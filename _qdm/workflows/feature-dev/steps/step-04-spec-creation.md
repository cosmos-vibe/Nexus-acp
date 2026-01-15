# Step 4: Spec Creation

> spec.md 생성

## Goal

요구사항과 분석 결과를 바탕으로 spec.md 문서를 작성합니다.

## Role

**기술 문서 작성자** - 명확하고 구조화된 명세서 작성

## Execution

```xml
<step-execution>

<phase n="1" name="Load Template">
  <action>Load {template_spec}</action>
  <prepare>Template with placeholders</prepare>
</phase>

<phase n="2" name="Fill Section 1: Overview">
  <collaborate>
    <display level-adaptive="true">
      <beginner>
        "spec.md를 함께 작성할 거예요. 첫 번째는 '개요' 섹션이에요.

        여기에는:
        - 이 기능이 뭔지 한 줄로 설명
        - 왜 필요한지
        - 누가 사용하는지

        를 적어요. 제가 초안을 작성할게요!"
      </beginner>
      <intermediate>
        "Overview 섹션 작성. 요약, 목적, 대상 사용자를 포함합니다."
      </intermediate>
      <advanced>
        "Section 1: Overview - summary, purpose, target users"
      </advanced>
      <expert>
        "S1: Overview"
      </expert>
    </display>
    <action>Generate overview based on step 2 data:</action>
    <generate>
      ## 1. Overview

      ### Summary
      {one_line_description}

      ### Purpose
      {why_needed}

      ### Target Users
      {target_users}
    </generate>
    <ask>"이렇게 작성했어요. 수정할 부분이 있나요?"</ask>
  </collaborate>
</phase>

<phase n="3" name="Fill Section 2: Research">
  <collaborate>
    <action>Generate research section based on step 2 data:</action>
    <generate>
      ## 2. Research

      ### Problem Statement
      {problem_statement}

      ### Similar Solutions
      {research_findings}

      ### Key Decisions
      {decisions_made}
    </generate>
    <ask>"리서치 섹션이에요. 추가할 내용이 있나요?"</ask>
  </collaborate>
</phase>

<phase n="4" name="Fill Section 3: Requirements">
  <collaborate>
    <action>Format requirements from step 2:</action>
    <generate>
      ## 3. Requirements

      ### Functional Requirements

      | ID | Description | Input | Output | Priority |
      |----|-------------|-------|--------|----------|
      | FR-1 | {desc} | {input} | {output} | {priority} |
      | FR-2 | ... | ... | ... | ... |

      ### Non-Functional Requirements

      | ID | Category | Description | Metric |
      |----|----------|-------------|--------|
      | NFR-1 | {category} | {desc} | {metric} |
      | NFR-2 | ... | ... | ... |
    </generate>
    <ask>"요구사항 정리예요. 빠진 것이나 수정할 것이 있나요?"</ask>
  </collaborate>
</phase>

<phase n="5" name="Fill Section 4: Success Criteria">
  <collaborate>
    <action>Format success criteria from step 2:</action>
    <generate>
      ## 4. Success Criteria

      ### Acceptance Criteria

      - [ ] AC-1: {criteria_1}
      - [ ] AC-2: {criteria_2}
      - [ ] AC-3: {criteria_3}

      ### Metrics

      | Metric | Target | Measurement Method |
      |--------|--------|-------------------|
      | {metric_1} | {target} | {method} |
    </generate>
    <ask>"성공 기준이에요. 측정 가능하게 작성했나요?"</ask>
  </collaborate>
</phase>

<phase n="6" name="Fill Section 5: References">
  <collaborate>
    <action>Compile references from step 3:</action>
    <generate>
      ## 5. References

      ### Related Code

      | File | Relevance |
      |------|-----------|
      | {file_1} | {why_relevant} |

      ### Dependencies

      - Internal: {internal_deps}
      - External: {external_deps}

      ### Documentation

      - {doc_links}
    </generate>
  </collaborate>
</phase>

<phase n="7" name="Review Complete Spec">
  <action>Display complete spec.md</action>
  <display level-adaptive="true">
    <beginner>
      "spec.md가 완성됐어요! 🎉

      전체 내용을 보여드릴게요.
      이 문서는 '뭘 만들 건지'를 정리한 거예요.
      나중에 다른 사람이 봐도 이해할 수 있어야 해요.

      {full_spec}

      괜찮아 보이나요?"
    </beginner>
    <intermediate>
      "spec.md 완성:

      {full_spec}

      확인해 주세요."
    </intermediate>
    <advanced>
      "spec.md ready for review:

      {full_spec}"
    </advanced>
    <expert>
      "spec.md: {section_summary}"
    </expert>
  </display>
  <options>
    [Y] 확인 - 저장하고 다음으로
    [E] 수정 - 특정 섹션 수정
    [R] 재작성 - 처음부터 다시
  </options>
</phase>

<phase n="8" name="Save spec.md">
  <action>Save to {default_output_folder}/spec.md</action>
  <verify>File created successfully</verify>
  <update meta.yaml>
    documents:
      spec: "spec.md"
    stepsCompleted: ["init", "requirement-research", "codebase-analysis", "spec-creation"]
  </update>
</phase>

</step-execution>
```

## Output

- `{sdd_root}/feature-{name}/spec.md` 생성됨
- meta.yaml 업데이트

## Next

Step 5 (Plan Creation)로 진행합니다.

## Menu

```
[A] Advanced Elicitation - spec 더 깊이 탐구
[P] Party Mode - 여러 관점에서 spec 검토
[C] Continue - 다음 단계로 (plan.md 작성)
[S] Save & Pause - 저장 후 나중에 재개
```
