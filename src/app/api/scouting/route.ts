import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import type { ApiResponse } from "@/types";

const MAX_BYTES_PER_FILE = 900 * 1024;
const MAX_TOTAL_BYTES = 3.5 * 1024 * 1024;

const PHOTO_KEYS = ["face", "side", "chest", "body"] as const;

function getEnv() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SCOUTING_EMAIL;
  const from = process.env.RESEND_FROM;
  return { apiKey, to, from };
}

export async function POST(request: NextRequest) {
  const { apiKey, to, from } = getEnv();

  if (!apiKey || !to || !from) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error:
          "Email is not configured. Set RESEND_API_KEY, SCOUTING_EMAIL, and RESEND_FROM.",
      },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const gender = String(formData.get("gender") ?? "").trim();
    const heightStr = String(formData.get("height") ?? "").trim();
    const height = Number(heightStr);
    const consentPrivacy =
      formData.get("consentPrivacy") === "on" ||
      formData.get("consentPrivacy") === "true";
    const consentAge =
      formData.get("consentAge") === "on" ||
      formData.get("consentAge") === "true";

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!["male", "female", "non-binary"].includes(gender)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Please select a gender option." },
        { status: 400 }
      );
    }

    if (!heightStr || !Number.isFinite(height) || height < 100 || height > 230) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Please enter a valid height in cm (100–230)." },
        { status: 400 }
      );
    }

    if (!consentPrivacy || !consentAge) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Please accept all required consents." },
        { status: 400 }
      );
    }

    const attachments: { filename: string; content: Buffer }[] = [];
    let totalSize = 0;

    for (const key of PHOTO_KEYS) {
      const file = formData.get(key);
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: `Please upload all four photos (${key} is missing).`,
          },
          { status: 400 }
        );
      }
      if (file.size > MAX_BYTES_PER_FILE) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: `Each photo must be under ${Math.round(MAX_BYTES_PER_FILE / 1024)} KB. "${key}" is too large.`,
          },
          { status: 400 }
        );
      }
      totalSize += file.size;
      const buf = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop()?.toLowerCase();
      const safeExt = ext && /^[a-z0-9]{2,5}$/.test(ext) ? ext : "jpg";
      attachments.push({
        filename: `${key}.${safeExt}`,
        content: buf,
      });
    }

    if (totalSize > MAX_TOTAL_BYTES) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error:
            "Total upload size is too large. Please use smaller images (under ~3.5 MB combined).",
        },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);
    const fullName = `${firstName} ${lastName}`;
    const genderLabel =
      gender === "male" ? "Male" : gender === "female" ? "Female" : "Non-binary";

    const textBody = [
      "New scouting application — LACE",
      "",
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Gender: ${genderLabel}`,
      `Height: ${height} cm`,
      "",
      "Photos are attached: face, side, chest, body.",
      "",
      "Consents: privacy notice accepted; 16+ confirmed.",
    ].join("\n");

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Scouting application — ${fullName}`,
      text: textBody,
      attachments,
    });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message || "Failed to send email." },
        { status: 502 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true });
  } catch (e) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: e instanceof Error ? e.message : "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
