# Step 2b: Investigate Bug

> 체계적 조사 (Complex Path)

## Goal

가설을 세우고 체계적으로 조사하여 근본 원인을 찾습니다.

## Role

**시니어 디버거** - 체계적이고 과학적인 디버깅 접근

## Execution

```xml
<step-execution>

<phase n="1" name="Create Status File">
  <load>{template_status}</load>
  <generate file="status.md">
    ---
    title: "{bug_title}"
    created: "{date}"
    status: investigating
    path: complex
    ---

    # Bug Fix: {bug_title}

    ## Symptoms
    {symptoms}

    ## Reproduction
    {reproduce_steps}

    ## Expected Behavior
    {expected_behavior}

    ## Investigation Log

    ### {date} - Initial Assessment

    **관찰:**
    - {observation_1}
    - {observation_2}

    **가설:**
    - H1: {hypothesis_1}
    - H2: {hypothesis_2}
    - H3: {hypothesis_3}

    ---

    ## Root Cause
    <!-- Step 3에서 채움 -->

    ## Fix Plan
    <!-- Step 4에서 채움 -->

    ## Tasks
    <!-- Step 4에서 채움 -->

    ## Work Log

    ### {date}
    - 조사 시작

    ## Debug Log
    | 날짜 | 문제 | 시도 | 결과 |
    |------|------|------|------|

    ## File List
    | 파일 | 상태 | 설명 |
    |------|------|------|
  </generate>
</phase>

<phase n="2" name="Form Hypotheses">
  <display level-adaptive="true">
    <beginner>
      "버그를 추적하는 탐정이 되어볼게요! 🕵️

      먼저 '가설'을 세워요. 가설이란 '아마 이게 원인일 것 같다'는 추측이에요.

      지금까지 알려진 정보로 볼 때, 이런 가능성이 있어요:

      **가설 1 (H1):** {hypothesis_1}
      - 왜 이렇게 생각하냐면: {reason_1}

      **가설 2 (H2):** {hypothesis_2}
      - 왜: {reason_2}

      **가설 3 (H3):** {hypothesis_3}
      - 왜: {reason_3}

      이제 하나씩 확인해 볼게요!"
    </beginner>
    <intermediate>
      "가설:
      - H1: {hypothesis_1}
      - H2: {hypothesis_2}
      - H3: {hypothesis_3}

      검증을 시작합니다."
    </intermediate>
    <advanced>
      "Hypotheses:
      H1: {hypothesis_1}
      H2: {hypothesis_2}
      H3: {hypothesis_3}"
    </advanced>
    <expert>
      "H1: {h1_short} | H2: {h2_short} | H3: {h3_short}"
    </expert>
  </display>
</phase>

<phase n="3" name="Test Hypotheses" loop="true">
  <for-each hypothesis in hypotheses>
    <display level-adaptive="true">
      <beginner>
        "**{hypothesis} 검증 중...**

        확인 방법:
        {verification_method}

        함께 확인해 볼게요!"
      </beginner>
      <intermediate>
        "Testing {hypothesis}:
        Method: {verification_method}"
      </intermediate>
      <advanced>
        "{hypothesis}: {verification_method}"
      </advanced>
      <expert>
        "{hypothesis}"
      </expert>
    </display>
    <action>
      - Read relevant files
      - Add console.log/breakpoints if needed
      - Check network requests
      - Review logs
    </action>
    <record in="Investigation Log">
      ### {date} - Testing {hypothesis}

      **검증 방법:** {verification_method}
      **필요한 증거:** {evidence_needed}
      **결과:** {result} (✓ 확인됨 | ✗ 배제됨 | ? 불확실)
      **발견:** {findings}
    </record>
    <append to="Debug Log">
      | {date} | {hypothesis} 검증 | {method} | {result} |
    </append>
  </for-each>
</phase>

<phase n="4" name="Analyze Results">
  <action>Review all hypothesis test results</action>
  <decision>
    <condition test="root_cause_found">
      <display level-adaptive="true">
        <beginner>
          "찾았어요! 🎯

          조사 결과, **{confirmed_hypothesis}**가 맞는 것 같아요.

          증거:
          {evidence_summary}

          다음 단계에서 이걸 확정하고 고칠 계획을 세울게요."
        </beginner>
        <intermediate>
          "Root cause likely: {confirmed_hypothesis}
          Evidence: {evidence_summary}
          → Step 3"
        </intermediate>
        <advanced>
          "Found: {confirmed_hypothesis}"
        </advanced>
        <expert>
          "→ {confirmed_hypothesis}"
        </expert>
      </display>
      <route>step-03-root-cause</route>
    </condition>
    <condition test="need_more_investigation">
      <display level-adaptive="true">
        <beginner>
          "음, 아직 확실하지 않네요. 🤔
          새로운 가설을 세워볼게요."
        </beginner>
        <intermediate>
          "추가 조사 필요. 새 가설 생성."
        </intermediate>
        <advanced>
          "More investigation needed"
        </advanced>
        <expert>
          "↻"
        </expert>
      </display>
      <action>Form new hypotheses and continue</action>
    </condition>
  </decision>
</phase>

</step-execution>
```

## Investigation Log Format

```markdown
### {date} - {investigation_title}

**가설:** {hypothesis}
**검증 방법:** {method}
**결과:** ✓ 확인됨 | ✗ 배제됨 | ? 불확실
**발견:** {findings}
**다음 단계:** {next_step}
```

## Output

- Investigation Log 기록
- 가설 검증 결과
- 근본 원인 후보

## Menu

```
[A] Advanced Elicitation - 더 깊은 분석
[P] Party Mode - 여러 관점에서 검토
[C] Continue - 근본 원인 확정으로 (step-03)
[S] Save & Pause - 저장 후 나중에
```
