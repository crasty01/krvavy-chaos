import * as v from 'valibot';


export const CharacterTeamSchema = v.picklist([
  'townsfolk', 'outsider', 'minion', 'demon', 'traveller', 'fabled', 'loric',
]);

export const SpecialTypeSchema = v.picklist([
  'selection', 'ability', 'signal', 'vote', 'reveal', 'player', 'reminder',
]);

export const SpecialNameSchema = v.picklist([
  'grimoire', 'pointing', 'ghost-votes', 'distribute-roles', 'bag-disabled',
  'bag-duplicate', 'good-duplicate', 'multiplier', 'hidden', 'replace-character',
  'player', 'card', 'open-eyes', 'public',
]);

export const SpecialTimeSchema = v.picklist([
  'pregame', 'day', 'night', 'firstNight', 'firstDay', 'otherNight', 'otherDay',
]);

export const SpecialGlobalSchema = v.picklist([
  'townsfolk', 'outsider', 'minion', 'demon', 'traveller', 'dead',
]);

export const AlignmentSchema = v.picklist(['good', 'neutral', 'evil']);


export const CharacterJinxSchema = v.object({
  id: v.pipe(v.string(), v.maxLength(50)),
  reason: v.pipe(v.string(), v.maxLength(500)),
});

export const CharacterSpecialSchema = v.object({
  type: SpecialTypeSchema,
  name: SpecialNameSchema,
  value: v.optional(v.union([v.pipe(v.string(), v.maxLength(50)), v.number()])),
  time: v.optional(SpecialTimeSchema),
  global: v.optional(SpecialGlobalSchema),
});


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
  reminders: v.optional(v.pipe(v.array(v.pipe(v.string(), v.maxLength(30))), v.maxLength(20)), []),
  remindersGlobal: v.optional(v.pipe(v.array(v.pipe(v.string(), v.maxLength(25))), v.maxLength(20)), []),
  setup: v.optional(v.boolean(), false),
  jinxes: v.optional(v.array(CharacterJinxSchema)),
  special: v.optional(v.array(CharacterSpecialSchema)),
});


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


export const OfficialCharacterIdSchema = v.pipe(v.string(), v.maxLength(20));

// Deprecated: old BotC tool exported characters as { id } objects instead of plain strings
const DeprecatedOfficialCharacterSchema = v.object({
  id: v.pipe(v.string(), v.maxLength(20)),
});

export const ScriptEntrySchema = v.union([
  ScriptCharacterSchema,
  ScriptMetaSchema,
  OfficialCharacterIdSchema,
]);

export const ScriptSchema = v.pipe(
  v.array(ScriptEntrySchema),
  v.minLength(5, 'A script must contain at least 5 items.'),
  v.maxLength(201, 'A script cannot contain more than 201 items.'),
);

// BotcScriptSchema additionally accepts deprecated { id } character objects
// and strips them out during parsing, outputting a clean Script
export const BotcScriptSchema = v.pipe(
  v.array(v.union([...ScriptEntrySchema.options, DeprecatedOfficialCharacterSchema])),
  v.transform((items) => items.filter(
    (item): item is BotcScriptEntry =>
      !(typeof item === 'object' && item !== null && !('name' in item) && (item as { id: string }).id !== '_meta'),
  )),
  v.minLength(5, 'A script must contain at least 5 items.'),
  v.maxLength(201, 'A script cannot contain more than 201 items.'),
);


export type BotcCharacterTeam = v.InferOutput<typeof CharacterTeamSchema>;
export type BotcSpecialType = v.InferOutput<typeof SpecialTypeSchema>;
export type BotcSpecialName = v.InferOutput<typeof SpecialNameSchema>;
export type BotcSpecialTime = v.InferOutput<typeof SpecialTimeSchema>;
export type BotcSpecialGlobal = v.InferOutput<typeof SpecialGlobalSchema>;
export type BotcAlignment = v.InferOutput<typeof AlignmentSchema>;
export type BotcCharacterJinx = v.InferOutput<typeof CharacterJinxSchema>;
export type BotcCharacterSpecial = v.InferOutput<typeof CharacterSpecialSchema>;
export type BotcScriptCharacter = v.InferOutput<typeof ScriptCharacterSchema>;
export type BotcScriptMeta = v.InferOutput<typeof ScriptMetaSchema>;
export type BotcScriptEntry = v.InferOutput<typeof ScriptEntrySchema>;
export type BotcScript = v.InferOutput<typeof ScriptSchema>;


export const TEAM_ORDER: Array<BotcCharacterTeam> = [
  'townsfolk', 'outsider', 'minion', 'demon', 'traveller', 'fabled', 'loric',
];

export const TEAM_LABELS: Record<BotcCharacterTeam, string> = {
  townsfolk: 'měšťané',
  outsider: 'podivíni',
  minion: 'přisluhovači',
  demon: 'démoni',
  traveller: 'pocestní',
  fabled: 'legendy',
  loric: 'loric',
};

export const TEAM_COLORS: Record<BotcCharacterTeam, string> = {
  townsfolk: '#1a65c0',
  outsider: '#46a5ca',
  minion: '#c44a2f',
  demon: '#c41520',
  traveller: '#7b4dc4',
  fabled: '#c4a82f',
  loric: '#4dc47b',
};


export const isScriptMeta = (entry: BotcScriptEntry): entry is BotcScriptMeta =>
  typeof entry === 'object' && entry.id === '_meta';

export const isScriptCharacter = (entry: BotcScriptEntry): entry is BotcScriptCharacter =>
  typeof entry === 'object' && entry.id !== '_meta' && 'name' in entry;

export const isOfficialCharacterId = (entry: BotcScriptEntry): entry is string =>
  typeof entry === 'string';

export const getScriptMeta = (script: BotcScript): BotcScriptMeta | undefined =>
  script.find(isScriptMeta);

export const getScriptCharacters = (script: BotcScript): Array<BotcScriptCharacter> =>
  script.filter(isScriptCharacter);

export const getCharactersByTeam = (characters: Array<BotcScriptCharacter>) => {
  const grouped = new Map<BotcCharacterTeam, Array<BotcScriptCharacter>>();
  for (const team of TEAM_ORDER) {
    const members = characters.filter((c) => c.team === team);
    if (members.length > 0) grouped.set(team, members);
  }
  return grouped;
};