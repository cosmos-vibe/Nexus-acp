# Feature Development Workflow Instructions

> 이 파일은 워크플로우 실행 시 로드되는 상세 지침입니다.

## Pre-requisites

- {profile_path} 로드 완료
- {sdd_root} 접근 가능
- {templates_path} 템플릿 파일 존재

## Execution Flow

```xml
<instruction-set>

<step n="1" name="init" goal="폴더 생성 및 초기화">
  <load>{steps_path}/step-01-init.md</load>
  <execute>
    - Ask for feature name if not provided
    - Check if folder exists (resume vs new)
    - Create folder structure
    - Generate meta.yaml from template
    - Load profile for level adaptation
  </execute>
  <output>meta.yaml created</output>
  <menu>[A] [P] [C] [S]</menu>
</step>

<step n="2" name="requirement-research" goal="요구사항 분석">
  <load>{steps_path}/step-02-requirement-research.md</load>
  <execute>
    - Role: 요구사항 분석가
    - Adapt questions to {profile}.overall_level
    - Ask: 해결할 문제, 대상 사용자, 성공 기준
    - Research similar solutions
    - Document FR-1, FR-2, NFR-1
  </execute>
  <output>Requirements documented in session</output>
  <menu>[A] [P] [C] [S]</menu>
</step>

<step n="3" name="codebase-analysis" goal="코드베이스 분석">
  <load>{steps_path}/step-03-codebase-analysis.md</load>
  <execute>
    - Role: 시니어 아키텍트
    - Use Glob/Grep/Read to explore codebase
    - Identify patterns (MVC, components, etc.)
    - Map dependencies
    - Explain findings at {profile}.overall_level
  </execute>
  <output>Codebase context documented</output>
  <menu>[A] [P] [C] [S]</menu>
</step>

<step n="4" name="spec-creation" goal="spec.md 생성">
  <load>{steps_path}/step-04-spec-creation.md</load>
  <execute>
    - Load template: {template_spec}
    - Fill 5 sections collaboratively:
      1. Overview
      2. Research
      3. Requirements (FR/NFR)
      4. Success Criteria
      5. References
    - Save to {default_output_folder}/spec.md
  </execute>
  <output>spec.md created</output>
  <menu>[A] [P] [C] [S]</menu>
</step>

<step n="5" name="plan-creation" goal="plan.md 생성">
  <load>{steps_path}/step-05-plan-creation.md</load>
  <execute>
    - Load template: {template_plan}
    - Fill 5 sections:
      1. Code Analysis (from step 3)
      2. Implementation Strategy
      3. Task List (Tasks/Subtasks)
      4. Test Strategy
      5. Risks
    - Save to {default_output_folder}/plan.md
  </execute>
  <output>plan.md created</output>
  <menu>[A] [P] [C] [S]</menu>
</step>

<step n="6" name="status-init" goal="status.md 초기화">
  <load>{steps_path}/step-06-status-init.md</load>
  <execute>
    - Load template: {template_status}
    - Copy Tasks from plan.md
    - Initialize Work Log, Debug Log, File List
    - Save to {default_output_folder}/status.md
  </execute>
  <output>status.md created</output>
  <menu>[A] [P] [C] [S]</menu>
</step>

<step n="7" name="ready-for-dev" goal="개발 준비 완료">
  <load>{steps_path}/step-07-ready-for-dev.md</load>
  <execute>
    - Display document summary
    - Provide level-appropriate development guide
    - Update index.yaml
    - Optionally update profile.yaml (new evidence)
  </execute>
  <output>Ready for development</output>
  <menu>[X] Workflow 종료</menu>
</step>

</instruction-set>
```

## Menu Handlers

### [A] Advanced Elicitation
```xml
<action>
  <load>{project-root}/{qdm_root}/workflows/advanced-elicitation/workflow.xml</load>
  <context>Current step context</context>
  <on-complete>Return to current step menu</on-complete>
</action>
```

### [P] Party Mode
```xml
<action>
  <load>{project-root}/{qdm_root}/workflows/party-mode/workflow.md</load>
  <context>Current step topic</context>
  <on-complete>Return to current step menu</on-complete>
</action>
```

### [C] Continue
```xml
<action>
  <update>meta.yaml stepsCompleted</update>
  <proceed>Next step</proceed>
</action>
```

### [S] Save & Pause
```xml
<action>
  <save>All current documents</save>
  <update>meta.yaml stepsCompleted, status: paused</update>
  <message>"저장했어요. /qdm → [RW]로 언제든 재개할 수 있어요."</message>
  <exit>Workflow</exit>
</action>
```

## Level Adaptation Rules

각 단계에서 {profile}.overall_level에 따라:

| Level | Question Style | Explanation Style | Code Reference |
|-------|---------------|-------------------|----------------|
| beginner | 친절하고 상세 | 비유 사용, 단계별 | "이 파일을 열어보세요" |
| intermediate | 핵심 위주 | 개념 설명 | "함수명: handleSubmit" |
| advanced | 간결 | 기술 용어 | "auth.ts의 validateToken" |
| expert | 최소 | 패턴 이름만 | "auth.ts:45" |
