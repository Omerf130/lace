export interface AboutPhone {
  label: string;
  number: string;
}

export interface AboutTeamMember {
  name: string;
  title: string;
  email: string;
  phones: AboutPhone[];
}

export interface AboutContent {
  intro: string;
  teamMembers: AboutTeamMember[];
  scoutingEmail: string;
}

const MAX_INTRO_LENGTH = 2000;
const MAX_STRING_LENGTH = 200;
const MAX_TEAM_MEMBERS = 30;
const MAX_PHONES_PER_MEMBER = 10;

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  intro:
    "We are an international boutique agency founded in 2018, embodying an exclusive collection of models. The agency represents the most unique and high-end talents this industry has to offer.",
  teamMembers: [
    {
      name: "Lauren Avichen",
      title: "CEO",
      email: "lauren@lacemodel.com",
      phones: [],
    },
    {
      name: "Shir",
      title: "Booker Junior",
      email: "shir@lacemodel.com",
      phones: [
        { label: "M", number: "+972 54-615-6776" },
        { label: "B", number: "+972 54-600-4652" },
      ],
    },
    {
      name: "Ofir",
      title: "Model Agent",
      email: "ofir@lacemodel.com",
      phones: [{ label: "B", number: "+972 50-300-8049" }],
    },
    {
      name: "Talia Nehama",
      title: "Head of Influencers",
      email: "digital@lacemodel.com",
      phones: [{ label: "Tel", number: "+972 54-549-9344" }],
    },
  ],
  scoutingEmail: "scouting@lacemodel.com",
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

export function validateAboutContent(
  data: unknown
): { ok: true; data: AboutContent } | { ok: false; error: string } {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { ok: false, error: "Content must be an object" };
  }

  const obj = data as Record<string, unknown>;

  if (!isNonEmptyString(obj.intro)) {
    return { ok: false, error: "intro is required and must be a non-empty string" };
  }
  if (obj.intro.length > MAX_INTRO_LENGTH) {
    return { ok: false, error: `intro must be at most ${MAX_INTRO_LENGTH} characters` };
  }

  if (!isNonEmptyString(obj.scoutingEmail)) {
    return { ok: false, error: "scoutingEmail is required and must be a non-empty string" };
  }
  if (obj.scoutingEmail.length > MAX_STRING_LENGTH) {
    return { ok: false, error: `scoutingEmail must be at most ${MAX_STRING_LENGTH} characters` };
  }

  if (!Array.isArray(obj.teamMembers)) {
    return { ok: false, error: "teamMembers must be an array" };
  }
  if (obj.teamMembers.length > MAX_TEAM_MEMBERS) {
    return { ok: false, error: `teamMembers must have at most ${MAX_TEAM_MEMBERS} entries` };
  }

  const members: AboutTeamMember[] = [];

  for (let i = 0; i < obj.teamMembers.length; i++) {
    const m = obj.teamMembers[i];
    if (!m || typeof m !== "object" || Array.isArray(m)) {
      return { ok: false, error: `teamMembers[${i}] must be an object` };
    }

    const member = m as Record<string, unknown>;

    if (!isNonEmptyString(member.name)) {
      return { ok: false, error: `teamMembers[${i}].name is required` };
    }
    if (member.name.length > MAX_STRING_LENGTH) {
      return { ok: false, error: `teamMembers[${i}].name is too long` };
    }

    if (!isString(member.title) || member.title.length > MAX_STRING_LENGTH) {
      return { ok: false, error: `teamMembers[${i}].title must be a string (max ${MAX_STRING_LENGTH} chars)` };
    }

    if (!isNonEmptyString(member.email)) {
      return { ok: false, error: `teamMembers[${i}].email is required` };
    }
    if (member.email.length > MAX_STRING_LENGTH) {
      return { ok: false, error: `teamMembers[${i}].email is too long` };
    }

    if (!Array.isArray(member.phones)) {
      return { ok: false, error: `teamMembers[${i}].phones must be an array` };
    }
    if (member.phones.length > MAX_PHONES_PER_MEMBER) {
      return { ok: false, error: `teamMembers[${i}].phones has too many entries` };
    }

    const phones: AboutPhone[] = [];

    for (let j = 0; j < member.phones.length; j++) {
      const p = member.phones[j];
      if (!p || typeof p !== "object" || Array.isArray(p)) {
        return { ok: false, error: `teamMembers[${i}].phones[${j}] must be an object` };
      }
      const phone = p as Record<string, unknown>;

      if (!isNonEmptyString(phone.label)) {
        return { ok: false, error: `teamMembers[${i}].phones[${j}].label is required` };
      }
      if (phone.label.length > MAX_STRING_LENGTH) {
        return { ok: false, error: `teamMembers[${i}].phones[${j}].label is too long` };
      }

      if (!isNonEmptyString(phone.number)) {
        return { ok: false, error: `teamMembers[${i}].phones[${j}].number is required` };
      }
      if (phone.number.length > MAX_STRING_LENGTH) {
        return { ok: false, error: `teamMembers[${i}].phones[${j}].number is too long` };
      }

      phones.push({ label: phone.label.trim(), number: phone.number.trim() });
    }

    members.push({
      name: member.name.trim(),
      title: (member.title as string).trim(),
      email: member.email.trim(),
      phones,
    });
  }

  return {
    ok: true,
    data: {
      intro: obj.intro.trim(),
      teamMembers: members,
      scoutingEmail: obj.scoutingEmail.trim(),
    },
  };
}
