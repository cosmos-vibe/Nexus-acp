# Step 2: Analyze Selected Work

> 선택된 작업 분석

## Goal

선택된 작업의 모든 문서를 읽고 현재 상태를 파악합니다.

## Execution

```xml
<step-execution>

<phase n="1" name="Read All Documents">
  <read>{selected_work}/meta.yaml</read>
  <context>
    type: {type}
    title: {title}
    status: {status}
    stepsCompleted: {steps}
  </context>

  <if type="feature">
    <read if_exists>{selected_work}/spec.md</read>
    <read if_exists>{selected_work}/plan.md</read>
    <read if_exists>{selected_work}/status.md</read>
  </if>

  <if type="bug">
    <read>{selected_work}/status.md</read>
    <extract>
      - Investigation Log
      - Root Cause (if found)
      - Fix Plan (if created)
    </extract>
  </if>

  <if type="ui">
    <read>{selected_work}/status.md</read>
  </if>
</phase>

<phase n="2" name="Determine Current State">
  <analyze>
    <what_completed>
      - Documents created
      - Steps finished
      - Tasks done
    </what_completed>
    <what_in_progress>
      - Current step
      - Current task
      - Last activity in Work Log
    </what_in_progress>
    <what_remaining>
      - Steps left
      - Tasks unchecked
      - Open issues
    </what_remaining>
  </analyze>
</phase>

<phase n="3" name="Check for Blockers">
  <scan>
    - Debug Log for unresolved issues
    - "blocked" status
    - Questions marked in documents
    - TODO comments
  </scan>
  <if blockers_found>
    <flag>{blockers_list}</flag>
  </if>
</phase>

<phase n="4" name="Extract Key Context">
  <if type="feature">
    <extract>
      - Problem statement (from spec)
      - Key requirements (FR-1, FR-2...)
      - Implementation approach (from plan)
      - Current task (from status)
      - Recent work log entries
    </extract>
  </if>
  <if type="bug">
    <extract>
      - Symptoms
      - Hypotheses tested
      - Root cause (if found)
      - Fix plan (if created)
      - Current investigation state
    </extract>
  </if>
  <if type="ui">
    <extract>
      - Change request
      - Files to modify
      - Current progress
    </extract>
  </if>
</phase>

<phase n="5" name="Identify Next Action">
  <determine based_on="stepsCompleted and current_state">
    <if feature>
      next_step: {step_name}
      next_action: {specific_action}
    </if>
    <if bug>
      next_step: {step_name}
      next_action: {specific_action}
    </if>
    <if ui>
      next_action: {specific_action}
    </if>
  </determine>
</phase>

</step-execution>
```

## Context Structure Built

```yaml
selected_work:
  type: feature
  title: "로그인 기능"
  path: "_sdd/feature-login"

completed:
  steps: ["init", "requirement-research", "codebase-analysis", "spec-creation"]
  documents: ["meta.yaml", "spec.md"]
  tasks: []

in_progress:
  step: "plan-creation"
  last_activity: "2026-01-07 - spec.md 완료"

remaining:
  steps: ["plan-creation", "status-init", "ready-for-dev"]
  tasks: ["T-1", "T-2", "T-3"]

blockers: []

next_action:
  step: "step-05-plan-creation"
  description: "plan.md 작성 시작"
```

## Output

- Complete context built
- Next action identified
- Blockers flagged (if any)

## Next

Step 3 (Summarize)로 진행합니다.
