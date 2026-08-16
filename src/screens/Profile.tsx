import { useState } from "react";
import { Check } from "lucide-react";
import strings from "../content/strings.json";
import { missions, activeKey } from "../content/mission";
import AppShell from "../components/shell/AppShell";
import Panel from "../components/shell/Panel";
import { findableCount, readProgress, type MissionRecord } from "../state/progress";
import type { GameState } from "../state/gameMachine";

/**
 * YOUR RECORD - the profile and skill tree.
 *
 * Five skills, always all five, whether earned or not. An evaluator has to be
 * able to see the shape of the whole game from a session that only contains two
 * missions, and a list that hid what has not happened yet would show a
 * scoreboard instead of an arc.
 *
 * Unearned skills recede STRUCTURALLY, never by fading the words - the same
 * argument the locked evidence slots settled (DECISIONS.md). They lose their
 * fill and keep --ink text, and they carry one extra line saying exactly what
 * would earn them. A greyed-out skill that does not say how to get it is a
 * locked door with no handle.
 *
 * Nothing here is awarded for its own sake: every skill resolves from something
 * the reducer already tracked - the path taken, the evidence found, which of
 * NOVA's questions were actually asked - read back out of the session record.
 */

interface Skill {
  id: string;
  name: string;
  teaches: string;
  how: string;
  /** Hub location id of the mission that teaches it. */
  mission: string;
}

const SKILLS = strings.profile.skills as Skill[];

/**
 * What each skill means in terms of what the player actually did.
 *
 * Deliberately not "completed mission N". A skill is a behaviour: stopping
 * before you share, tracing a claim, pushing a confident answer for a source,
 * finding the cut in a real video, saying in public what you know and what you
 * don't. Tying them to missions would make them a progress bar; tying them to
 * acts makes them a description of the player.
 */
function earnedSkills(records: MissionRecord[]): Set<string> {
  const earned = new Set<string>();
  for (const record of records) {
    if (record.path !== "careless") earned.add("stop");
    if (record.foundAll) earned.add("verify");
    if (record.novaUsed.includes("ask-source")) earned.add("question");
    if (record.key === "02" && record.evidenceFound.includes("ev-02")) earned.add("discern");
    if (record.path === "correction") earned.add("respond");
  }
  return earned;
}

/** The label the mission itself gave that ending, so the two never drift. */
function pathLabel(record: MissionRecord): string {
  const mission = missions[record.key];
  const decision = (mission?.decisions as { label: string; outcome: string }[] | undefined)?.find(
    (d) => d.outcome === record.path,
  );
  return decision?.label ?? record.path;
}

/*
 * Earned keeps its fill and a solid hairline; unearned has neither. Dashed,
 * because that is already what this build means by "not yet" - it is the same
 * edge the gated NOVA reply wears - and it is deliberately NOT the hatching the
 * locked rooms and evidence slots use, which means "not in this build at all".
 * An unearned skill is available; it just has not happened yet.
 */
function SkillRow({
  skill,
  earned,
  onEnter,
}: {
  skill: Skill;
  earned: boolean;
  onEnter: (key: string) => void;
}) {
  const mission = missions[skill.mission];
  return (
    <li
      className={`rounded-doc border p-4 ${
        earned ? "border-line bg-surface/[0.62]" : "border-dashed border-line"
      }`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-base font-bold uppercase tracking-[0.08em] text-ink">
          {skill.name}
        </h3>
        {/*
          Cyan, and it is the same cyan as the lessons on Reflect: a skill you
          have earned is a thing about you that has been verified. Never colour
          alone - the tick is paired with the word.
        */}
        {earned ? (
          <span className="flex shrink-0 items-center gap-2 font-mono text-2xs uppercase tracking-[0.16em] text-verified">
            <Check className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
            {strings.profile.earned}
          </span>
        ) : (
          <span className="shrink-0 font-mono text-2xs uppercase tracking-[0.16em] text-ink-mute">
            {strings.profile.notEarned}
          </span>
        )}
      </div>

      <p className="mt-2 max-w-[52ch] text-sm text-ink-mute">{skill.teaches}</p>

      {!earned && (
        <>
          <p className="mt-3 font-mono text-2xs leading-[16px] text-ink-mute">
            {strings.profile.howLabel}: {skill.how}
          </p>
          {/*
            The one thing to do in this room.

            An unearned skill that only describes itself is a poster, and this
            room had five of them - which is how a judge who opens it first
            decides the whole build is a dashboard before they have played
            anything. Naming the mission that teaches it and going there turns
            the record into a way back into the game. Neutral treatment: this is
            navigation, so it takes no semantic colour.
          */}
          {mission && (
            <button
              type="button"
              onClick={() => onEnter(skill.mission)}
              className="mt-3 rounded-btn border border-line px-4 py-2 font-mono text-2xs uppercase tracking-[0.16em] text-ink transition-colors duration-[120ms] ease-real hover:border-ink-mute"
            >
              {strings.profile.earnIn} {mission.title}
            </button>
          )}
        </>
      )}
    </li>
  );
}

export default function Profile({
  state,
  onEnter,
  onNavigate,
}: {
  state: GameState;
  /** Same route the city map uses, so a skill can send you at its mission. */
  onEnter: (key: string) => void;
  onNavigate: (phase: GameState["phase"]) => void;
}) {
  const [stored] = useState(readProgress);

  /*
   * The run in progress counts too. A player who has just finished a mission
   * and walked into this room should not have to wonder why the badge they are
   * still looking at on the reflect screen is missing from their own record.
   */
  const live: MissionRecord[] = state.path
    ? [
        {
          missionId: missions[activeKey]?.missionId ?? activeKey,
          key: activeKey,
          title: missions[activeKey]?.title ?? "",
          path: state.path,
          badge: state.badge,
          evidenceFound: state.evidenceFound,
          novaUsed: state.novaUsed,
          foundAll: state.evidenceFound.length >= findableCount(activeKey),
        },
      ]
    : [];

  const records = [
    ...Object.values(stored).filter((r) => !live.some((l) => l.key === r.key)),
    ...live,
  ].sort((a, b) => a.key.localeCompare(b.key));

  const earned = earnedSkills(records);
  const badges = [...new Set(records.map((r) => r.badge).filter((b): b is string => Boolean(b)))];

  return (
    <AppShell phase={state.phase} onNavigate={onNavigate} heading={strings.panels.profile.title}>
      <main className="mx-auto min-h-full max-w-[1400px] p-3 lg:p-6">
        <Panel
          title={strings.panels.profile.title}
          subtitle={strings.panels.profile.subtitle}
          headingId="panel-profile"
          active
        >
          {/*
            Unequal columns, like every other screen in this build: the skills
            are the subject and the record beside them is the footnote.
          */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section aria-labelledby="profile-skills">
              <h2 id="profile-skills" className="label-mono">
                {strings.profile.skillsLabel}
              </h2>
              <p className="mt-2 max-w-[62ch] text-sm text-ink-mute">
                {strings.profile.skillsNote}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {SKILLS.map((skill) => (
                  <SkillRow
                    key={skill.id}
                    skill={skill}
                    earned={earned.has(skill.id)}
                    onEnter={onEnter}
                  />
                ))}
              </ul>
            </section>

            <div className="flex flex-col gap-6">
              <section aria-labelledby="profile-player" className="rounded-doc border border-line p-4">
                <h2 id="profile-player" className="label-mono">
                  {strings.profile.player}
                </h2>
                <p className="mt-2 font-display text-xl font-bold tracking-[-0.02em] text-ink">
                  {strings.profile.level}
                </p>
              </section>

              <section aria-labelledby="profile-badges">
                <h2 id="profile-badges" className="label-mono">
                  {strings.profile.badgesLabel}
                </h2>
                {badges.length === 0 ? (
                  <p className="mt-2 text-sm text-ink-mute">{strings.profile.noBadges}</p>
                ) : (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {badges.map((badge) => (
                      <li
                        key={badge}
                        className="rounded-btn border border-line bg-surface/[0.62] px-3 py-2 font-mono text-2xs uppercase tracking-[0.04em] text-ink"
                      >
                        {badge}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section aria-labelledby="profile-missions">
                <h2 id="profile-missions" className="label-mono">
                  {strings.profile.missionsLabel}
                </h2>
                {records.length === 0 ? (
                  <p className="mt-2 text-sm text-ink-mute">{strings.profile.noMissions}</p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-2">
                    {records.map((record) => (
                      <li key={record.key} className="border-l border-line pl-3">
                        <p className="text-sm text-ink">{record.title}</p>
                        <p className="font-mono text-2xs text-ink-mute">
                          {pathLabel(record)}
                          {record.badge ? ` · ${record.badge}` : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </Panel>
      </main>
    </AppShell>
  );
}
