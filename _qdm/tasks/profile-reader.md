# Task: Profile Reader

> 사용자 프로필 로드 및 수준별 적응

## Purpose

profile.yaml을 읽고 사용자 수준에 맞춘 응답을 위한 컨텍스트를 제공합니다.

## Input

| Parameter | Source | Description |
|-----------|--------|-------------|
| profile_path | config.yaml | 프로필 파일 경로 |

## Execution

```xml
<task name="profile-reader">

<step n="1" name="Load Profile">
  <read>{profile_path}</read>
  <if file_not_exists>
    <return>
      overall_level: "intermediate"  # default
      skills: {}
      preferences:
        detail_level: "normal"
        use_analogies: true
        show_examples: true
    </return>
  </if>
</step>

<step n="2" name="Parse Profile">
  <extract>
    overall_level: beginner | intermediate | advanced | expert
    skills:
      frontend: { level, evidence, gaps }
      backend: { level, evidence, gaps }
      database: { level, evidence, gaps }
      debugging: { level, evidence, gaps }
    preferences:
      detail_level: minimal | normal | detailed
      use_analogies: boolean
      show_examples: boolean
      language: string
  </extract>
</step>

<step n="3" name="Determine Effective Level">
  <logic>
    # For domain-specific tasks, use domain level if available
    # Otherwise, fall back to overall_level

    effective_level = skills.{current_domain}.level ?? overall_level
  </logic>
</step>

<step n="4" name="Return Context">
  <return>
    overall_level: {overall_level}
    effective_level: {effective_level}
    skills: {skills}
    preferences: {preferences}
    adaptation_rules: {
      beginner: {
        explain_concepts: true,
        use_analogies: true,
        step_by_step: true,
        code_comments: "detailed"
      },
      intermediate: {
        explain_concepts: "when_relevant",
        use_analogies: "occasionally",
        step_by_step: "for_complex",
        code_comments: "moderate"
      },
      advanced: {
        explain_concepts: false,
        use_analogies: false,
        step_by_step: false,
        code_comments: "minimal"
      },
      expert: {
        explain_concepts: false,
        use_analogies: false,
        step_by_step: false,
        code_comments: "none"
      }
    }
  </return>
</step>

</task>
```

## Output

```yaml
overall_level: "intermediate"
effective_level: "beginner"  # if current domain is frontend and frontend.level is beginner
skills:
  frontend:
    level: "beginner"
    evidence: ["React 컴포넌트 구조 이해"]
    gaps: ["상태 관리 라이브러리 미숙"]
  backend:
    level: "intermediate"
    evidence: [...]
    gaps: [...]
preferences:
  detail_level: "detailed"
  use_analogies: true
  show_examples: true
adaptation_rules:
  # Based on effective_level
```

## Usage

```xml
<task-call name="profile-reader">
  <param name="profile_path">{sdd_root}/_user/profile.yaml</param>
</task-call>

<!-- Now {profile} is available with all extracted data -->
<if profile.effective_level == "beginner">
  <!-- Use beginner-friendly explanations -->
</if>
```

## Level Adaptation Guide

| Level | Greeting | Explanation | Code Reference |
|-------|----------|-------------|----------------|
| beginner | 친근하고 환영하는 | 비유 + 단계별 | "이 파일을 열어보세요" |
| intermediate | 협업적 | 핵심 개념 | "handleSubmit 함수" |
| advanced | 간결한 | 기술 용어 | "auth.ts:validateToken" |
| expert | 최소 | 패턴 이름 | "auth.ts:45" |
