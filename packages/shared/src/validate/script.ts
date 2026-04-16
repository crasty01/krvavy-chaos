import * as v from 'valibot';

// --- Reusable Enums / Picklists ---
const TeamSchema = v.picklist([
  'townsfolk', 'outsider', 'minion', 'demon', 'traveller', 'fabled', 'loric'
]);

const SpecialTypeSchema = v.picklist([
  'selection', 'ability', 'signal', 'vote', 'reveal', 'player', 'reminder'
]);

const SpecialNameSchema = v.picklist([
  'grimoire', 'pointing', 'ghost-votes', 'distribute-roles', 'bag-disabled', 
  'bag-duplicate', 'good-duplicate', 'multiplier', 'hidden', 'replace-character', 
  'player', 'card', 'open-eyes', 'public'
]);

const SpecialTimeSchema = v.picklist([
  'pregame', 'day', 'night', 'firstNight', 'firstDay', 'otherNight', 'otherDay'
]);

const SpecialGlobalSchema = v.picklist([
  'townsfolk', 'outsider', 'minion', 'demon', 'traveller', 'dead'
]);

// --- Component Schemas ---
const ImageSchema = v.union([
  v.pipe(v.string(), v.url("Must be a valid URI")),
  v.pipe(
    v.array(v.pipe(v.string(), v.url("Must be a valid URI"))),
    v.minLength(1),
    v.maxLength(3)
  )
]);

const JinxSchema = v.object({
  id: v.pipe(v.string(), v.maxLength(50)),
  reason: v.pipe(v.string(), v.maxLength(500))
});

const SpecialSchema = v.object({
  type: SpecialTypeSchema,
  name: SpecialNameSchema,
  value: v.optional(
    v.union([
      v.pipe(v.string(), v.maxLength(50)),
      v.number()
    ])
  ),
  time: v.optional(SpecialTimeSchema),
  global: v.optional(SpecialGlobalSchema)
});

// --- Main Array Item Types ---

// 1. Script Character Object
const ScriptCharacterSchema = v.object({
  id: v.pipe(v.string(), v.maxLength(50)),
  name: v.pipe(v.string(), v.maxLength(30)),
  image: v.optional(ImageSchema),
  team: TeamSchema,
  edition: v.optional(v.pipe(v.string(), v.maxLength(50))),
  ability: v.pipe(v.string(), v.maxLength(250)),
  flavor: v.optional(v.pipe(v.string(), v.maxLength(500))),
  firstNight: v.optional(v.number()),
  firstNightReminder: v.optional(v.pipe(v.string(), v.maxLength(500))),
  otherNight: v.optional(v.number()),
  otherNightReminder: v.optional(v.pipe(v.string(), v.maxLength(500))),
  reminders: v.optional(
    v.pipe(v.array(v.pipe(v.string(), v.maxLength(30))), v.maxLength(20)),
    [] // Default
  ),
  remindersGlobal: v.optional(
    v.pipe(v.array(v.pipe(v.string(), v.maxLength(25))), v.maxLength(20)),
    [] // Default
  ),
  setup: v.optional(v.boolean(), false), // Default
  jinxes: v.optional(v.array(JinxSchema)),
  special: v.optional(v.array(SpecialSchema))
});

// 2. Script Metadata Object
const ScriptMetadataSchema = v.object({
  id: v.literal('_meta'),
  name: v.pipe(v.string(), v.maxLength(50)),
  author: v.optional(v.pipe(v.string(), v.maxLength(50))),
  logo: v.optional(v.pipe(v.string(), v.maxLength(250), v.url("Must be a valid URI"))),
  hideTitle: v.optional(v.boolean()),
  background: v.optional(v.pipe(v.string(), v.maxLength(250), v.url("Must be a valid URI"))),
  almanac: v.optional(v.pipe(v.string(), v.maxLength(250), v.url("Must be a valid URI"))),
  bootlegger: v.optional(v.pipe(v.array(v.string()), v.maxLength(10))),
  firstNight: v.optional(v.pipe(v.array(v.string()), v.maxLength(200))),
  otherNight: v.optional(v.pipe(v.array(v.string()), v.maxLength(200)))
});

// 3. Official Character String
const OfficialCharacterStringSchema = v.pipe(v.string(), v.maxLength(20));

// 4. Deprecated Official Character Object
const DeprecatedOfficialCharacterSchema = v.object({
  id: v.pipe(v.string(), v.maxLength(20))
});

// --- Final Root Schema ---
const ScriptItemSchema = v.union([
  ScriptCharacterSchema,
  OfficialCharacterStringSchema,
  ScriptMetadataSchema,
  DeprecatedOfficialCharacterSchema
]);

export const BotcScriptSchema = v.pipe(
  v.array(ScriptItemSchema),
  v.minLength(5, "A script must contain at least 5 items."),
  v.maxLength(201, "A script cannot contain more than 201 items.")
);

// --- Type Exports ---
export type BotcScript = v.InferOutput<typeof BotcScriptSchema>;
export type ScriptCharacter = v.InferOutput<typeof ScriptCharacterSchema>;
export type ScriptMetadata = v.InferOutput<typeof ScriptMetadataSchema>;