// ─── BotC Script Types ───────────────────────────────────────────────
// Valibot schemas derived from botc-schema.json — types are inferred

import * as v from 'valibot';

// ─── Enums ───────────────────────────────────────────────────────────

export const CharacterTeamSchema = v.picklist([
  'townsfolk',
  'outsider',
  'minion',
  'demon',
  'traveller',
  'fabled',
  'loric',
]);

export const SpecialTypeSchema = v.picklist([
  'selection',
  'ability',
  'signal',
  'vote',
  'reveal',
  'player',
  'reminder',
]);

export const SpecialNameSchema = v.picklist([
  'grimoire',
  'pointing',
  'ghost-votes',
  'distribute-roles',
  'bag-disabled',
  'bag-duplicate',
  'good-duplicate',
  'multiplier',
  'hidden',
  'replace-character',
  'player',
  'card',
  'open-eyes',
  'public',
]);

export const SpecialTimeSchema = v.picklist([
  'pregame',
  'day',
  'night',
  'firstNight',
  'firstDay',
  'otherNight',
  'otherDay',
]);

export const SpecialGlobalSchema = v.picklist([
  'townsfolk',
  'outsider',
  'minion',
  'demon',
  'traveller',
  'dead',
]);

export const AlignmentSchema = v.picklist(['good', 'neutral', 'evil']);

// ─── Sub-objects ─────────────────────────────────────────────────────

export const CharacterJinxSchema = v.object({
  id: v.pipe(v.string(), v.maxLength(50)),
  reason: v.pipe(v.string(), v.maxLength(500)),
});

export const CharacterSpecialSchema = v.object({
  type: SpecialTypeSchema,
  name: SpecialNameSchema,
  value: v.optional(v.union([v.string(), v.number()])),
  time: v.optional(SpecialTimeSchema),
  global: v.optional(SpecialGlobalSchema),
});

// ─── Character ───────────────────────────────────────────────────────

export const ScriptCharacterSchema = v.object({
  id: v.pipe(v.string(), v.maxLength(50)),
  name: v.pipe(v.string(), v.maxLength(30)),
  team: CharacterTeamSchema,
  ability: v.pipe(v.string(), v.maxLength(250)),
  image: v.optional(
    v.union([
      v.pipe(v.string(), v.url()),
      v.pipe(v.array(v.pipe(v.string(), v.url())), v.minLength(1), v.maxLength(3)),
    ]),
  ),
  edition: v.optional(v.pipe(v.string(), v.maxLength(50))),
  flavor: v.optional(v.pipe(v.string(), v.maxLength(500))),
  firstNight: v.optional(v.number()),
  firstNightReminder: v.optional(v.pipe(v.string(), v.maxLength(500))),
  otherNight: v.optional(v.number()),
  otherNightReminder: v.optional(v.pipe(v.string(), v.maxLength(500))),
  reminders: v.optional(v.pipe(v.array(v.pipe(v.string(), v.maxLength(30))), v.maxLength(20))),
  remindersGlobal: v.optional(v.pipe(v.array(v.pipe(v.string(), v.maxLength(25))), v.maxLength(20))),
  setup: v.optional(v.boolean()),
  jinxes: v.optional(v.array(CharacterJinxSchema)),
  special: v.optional(v.array(CharacterSpecialSchema)),
});

// ─── Meta ────────────────────────────────────────────────────────────

export const ScriptMetaSchema = v.object({
  id: v.literal('_meta'),
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
  author: v.optional(v.pipe(v.string(), v.maxLength(50))),
  logo: v.optional(v.pipe(v.string(), v.url(), v.maxLength(250))),
  background: v.optional(v.pipe(v.string(), v.url(), v.maxLength(250))),
  hideTitle: v.optional(v.boolean()),
  almanac: v.optional(v.pipe(v.string(), v.url(), v.maxLength(250))),
  bootlegger: v.optional(v.pipe(v.array(v.string()), v.maxLength(10))),
  firstNight: v.optional(v.pipe(v.array(v.string()), v.maxLength(200))),
  otherNight: v.optional(v.pipe(v.array(v.string()), v.maxLength(200))),
});

// ─── Script Entry & Script ───────────────────────────────────────────

export const OfficialCharacterIdSchema = v.pipe(v.string(), v.maxLength(20));

export const ScriptEntrySchema = v.union([
  ScriptCharacterSchema,
  ScriptMetaSchema,
  OfficialCharacterIdSchema,
]);

export const ScriptSchema = v.pipe(
  v.array(ScriptEntrySchema),
  v.minLength(1),
  v.maxLength(201),
);

// ─── Inferred Types ─────────────────────────────────────────────────

export type CharacterTeam = v.InferOutput<typeof CharacterTeamSchema>;
export type SpecialType = v.InferOutput<typeof SpecialTypeSchema>;
export type SpecialName = v.InferOutput<typeof SpecialNameSchema>;
export type SpecialTime = v.InferOutput<typeof SpecialTimeSchema>;
export type SpecialGlobal = v.InferOutput<typeof SpecialGlobalSchema>;
export type Alignment = v.InferOutput<typeof AlignmentSchema>;
export type CharacterJinx = v.InferOutput<typeof CharacterJinxSchema>;
export type CharacterSpecial = v.InferOutput<typeof CharacterSpecialSchema>;
export type ScriptCharacter = v.InferOutput<typeof ScriptCharacterSchema>;
export type ScriptMeta = v.InferOutput<typeof ScriptMetaSchema>;
export type ScriptEntry = v.InferOutput<typeof ScriptEntrySchema>;
export type Script = v.InferOutput<typeof ScriptSchema>;

export const TEAM_ORDER: Array<CharacterTeam> = [
  'townsfolk',
  'outsider',
  'minion',
  'demon',
  'traveller',
  'fabled',
  'loric',
];

export const TEAM_LABELS: Record<CharacterTeam, string> = {
  townsfolk: 'Měšťané',
  outsider: 'Podivíni',
  minion: 'Přisluhovači',
  demon: 'Démoni',
  traveller: 'Pocestní',
  fabled: 'Báječné',
  loric: 'Loric',
};

export const TEAM_COLORS: Record<CharacterTeam, string> = {
  townsfolk: '#1a65c0',
  outsider: '#46a5ca',
  minion: '#c44a2f',
  demon: '#c41520',
  traveller: '#7b4dc4',
  fabled: '#c4a82f',
  loric: '#4dc47b',
};

// ─── Helpers ─────────────────────────────────────────────────────────

export const isScriptMeta = (entry: ScriptEntry): entry is ScriptMeta =>
  typeof entry === 'object' && entry.id === '_meta';

export const isScriptCharacter = (entry: ScriptEntry): entry is ScriptCharacter =>
  typeof entry === 'object' && entry.id !== '_meta';

export const isOfficialCharacterId = (entry: ScriptEntry): entry is string =>
  typeof entry === 'string';

export const getScriptMeta = (script: Script): ScriptMeta | undefined =>
  script.find(isScriptMeta);

export const getScriptCharacters = (script: Script): Array<ScriptCharacter> =>
  script.filter(isScriptCharacter);

export const getCharactersByTeam = (characters: Array<ScriptCharacter>) => {
  const grouped = new Map<CharacterTeam, Array<ScriptCharacter>>();
  for (const team of TEAM_ORDER) {
    const members = characters.filter((c) => c.team === team);
    if (members.length > 0) grouped.set(team, members);
  }
  return grouped;
};
