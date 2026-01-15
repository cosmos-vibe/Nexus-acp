# Step 2: Requirement Research

> 요구사항 분석 및 리서치

## Goal

기능의 요구사항을 명확히 파악하고 Functional/Non-Functional Requirements를 도출합니다.

## Role

**요구사항 분석가** - 사용자의 의도를 파악하고 구체적인 요구사항으로 변환

## Execution

```xml
<step-execution>

<phase n="1" name="Understand the Problem">
  <ask level-adaptive="true">
    <beginner>
      "이 기능으로 어떤 문제를 해결하고 싶으세요?

      예를 들어:
      - '사용자가 매번 로그인해야 해서 불편해요'
      - '검색이 느려서 원하는 걸 못 찾아요'

      편하게 설명해 주세요!"
    </beginner>
    <intermediate>
      "해결하려는 문제가 뭔가요? 현재 상황과 원하는 상태를 설명해 주세요."
    </intermediate>
    <advanced>
      "Problem statement? Current state vs desired state."
    </advanced>
    <expert>
      "Problem:"
    </expert>
  </ask>
  <store as="problem_statement" />
</phase>

<phase n="2" name="Identify Users">
  <ask level-adaptive="true">
    <beginner>
      "이 기능을 누가 사용하나요?

      예: '일반 사용자', '관리자', '게스트' 등
      여러 종류면 모두 알려주세요!"
    </beginner>
    <intermediate>
      "대상 사용자는? (역할, 특성)"
    </intermediate>
    <advanced>
      "Target users and their characteristics?"
    </advanced>
    <expert>
      "Users:"
    </expert>
  </ask>
  <store as="target_users" />
</phase>

<phase n="3" name="Define Success Criteria">
  <ask level-adaptive="true">
    <beginner>
      "이 기능이 성공하면 어떻게 알 수 있을까요?

      예:
      - '로그인 없이 3일 동안 유지되면 성공'
      - '검색 결과가 1초 안에 나오면 성공'

      구체적인 숫자가 있으면 더 좋아요!"
    </beginner>
    <intermediate>
      "성공 기준은? 측정 가능한 지표로 설명해 주세요."
    </intermediate>
    <advanced>
      "Success criteria? Measurable metrics."
    </advanced>
    <expert>
      "Success metrics:"
    </expert>
  </ask>
  <store as="success_criteria" />
</phase>

<phase n="4" name="Research Similar Solutions">
  <action>Based on problem_statement, search for similar patterns in:</action>
  <sources>
    - Existing codebase (Glob/Grep)
    - Common industry patterns
    - Known libraries/frameworks
  </sources>
  <report level-adaptive="true">
    <beginner>
      "비슷한 기능이 이미 있는지 찾아봤어요:

      ✓ 찾은 것: {existing_patterns}
      → 이걸 참고하면 좋을 것 같아요!

      ✗ 없는 것: {missing_patterns}
      → 이건 새로 만들어야 해요."
    </beginner>
    <intermediate>
      "기존 패턴 분석:
      - 재사용 가능: {existing_patterns}
      - 신규 개발 필요: {missing_patterns}"
    </intermediate>
    <advanced>
      "Existing: {existing_patterns}
      New required: {missing_patterns}"
    </advanced>
    <expert>
      "Reuse: {existing_patterns} | New: {missing_patterns}"
    </expert>
  </report>
  <store as="research_findings" />
</phase>

<phase n="5" name="Document Requirements">
  <action>Based on gathered information, formulate:</action>

  <functional_requirements>
    <format>
      FR-1: {description}
        - Input: {what user provides}
        - Output: {expected result}
        - Validation: {rules}

      FR-2: ...
    </format>
    <example>
      FR-1: 사용자 로그인
        - Input: 이메일, 비밀번호
        - Output: 인증 토큰, 사용자 정보
        - Validation: 이메일 형식, 비밀번호 8자 이상
    </example>
  </functional_requirements>

  <non_functional_requirements>
    <format>
      NFR-1: {category}: {description}

      Categories: Performance, Security, Usability, Reliability
    </format>
    <example>
      NFR-1: Performance: 로그인 응답 시간 < 2초
      NFR-2: Security: 비밀번호 해시 저장 (bcrypt)
      NFR-3: Usability: 로그인 실패 시 명확한 에러 메시지
    </example>
  </non_functional_requirements>

  <store as="requirements" />
</phase>

<phase n="6" name="Confirm with User">
  <display level-adaptive="true">
    <beginner>
      "정리한 요구사항이에요. 맞는지 확인해 주세요!

      📋 기능 요구사항 (해야 할 것)
      {functional_requirements}

      ⚙️ 비기능 요구사항 (지켜야 할 것)
      {non_functional_requirements}

      수정할 부분이 있으면 알려주세요!"
    </beginner>
    <intermediate>
      "요구사항 정리:

      FR: {functional_requirements}
      NFR: {non_functional_requirements}

      확인 또는 수정사항?"
    </intermediate>
    <advanced>
      "FR: {functional_requirements}
      NFR: {non_functional_requirements}
      Confirm?"
    </advanced>
    <expert>
      "FR: {fr_summary} | NFR: {nfr_summary} | OK?"
    </expert>
  </display>
  <options>
    [Y] 확인 - 다음 단계로
    [E] 수정 - 요구사항 수정
  </options>
</phase>

<phase n="7" name="Update meta.yaml">
  <action>Add to meta.yaml:</action>
  <add>
    requirements:
      problem: "{problem_statement}"
      users: "{target_users}"
      success_criteria: "{success_criteria}"
      functional: [FR-1, FR-2, ...]
      non_functional: [NFR-1, NFR-2, ...]
    stepsCompleted: ["init", "requirement-research"]
  </add>
  <save>{default_output_folder}/meta.yaml</save>
</phase>

</step-execution>
```

## Output

- 요구사항 목록 (FR/NFR)
- meta.yaml 업데이트

## Next

Step 3 (Codebase Analysis)로 진행합니다.

## Menu

```
[A] Advanced Elicitation - 요구사항 더 깊이 탐구
[P] Party Mode - 여러 관점에서 요구사항 검토
[C] Continue - 다음 단계로 (코드베이스 분석)
[S] Save & Pause - 저장 후 나중에 재개
```
