# Step 1: Assess Bug

> 버그 정보 수집 및 복잡도 판단

## Goal

버그를 이해하고 Simple vs Complex 경로를 결정합니다.

## Execution

```xml
<step-execution>

<phase n="1" name="Gather Information">
  <display level-adaptive="true">
    <beginner>
      "버그를 해결하려면 먼저 잘 이해해야 해요! 🔍

      알려주세요:
      1. **증상**: 뭐가 잘못되고 있나요?
      2. **재현 방법**: 어떻게 하면 이 버그가 나타나나요?
      3. **예상 동작**: 원래 어떻게 되어야 하나요?
      4. **에러 메시지**: 에러가 있다면 복사해 주세요"
    </beginner>
    <intermediate>
      "버그 정보:
      1. 증상
      2. 재현 방법
      3. 예상 동작
      4. 에러 메시지 (있다면)"
    </intermediate>
    <advanced>
      "Bug info: symptoms, reproduction, expected, error message"
    </advanced>
    <expert>
      "Symptoms? Repro? Expected? Error?"
    </expert>
  </display>
  <gather>
    symptoms: What's happening wrong
    reproduce_steps: How to trigger the bug
    expected_behavior: What should happen
    error_message: Any error output
  </gather>
</phase>

<phase n="2" name="Quick Investigation">
  <action>Use Grep to search for error patterns:</action>
  <search>
    - Error message keywords
    - Related file names
    - Function names from stack trace
  </search>
  <action>Read suspicious files</action>
  <evaluate>
    - Can we identify the cause?
    - How many files involved?
    - How long to fix?
  </evaluate>
</phase>

<phase n="3" name="Complexity Decision">
  <decision>
    <condition test="cause_identified AND files <= 2 AND estimated_time < 30min">
      <result>SIMPLE</result>
      <display level-adaptive="true">
        <beginner>
          "원인을 찾은 것 같아요! 💡

          문제: {cause_summary}
          파일: {suspect_file}

          간단히 해결할 수 있을 것 같아요.
          바로 수정해볼까요?"
        </beginner>
        <intermediate>
          "원인 파악됨: {cause_summary}
          File: {suspect_file}
          Simple path로 진행합니다."
        </intermediate>
        <advanced>
          "Cause: {cause_summary}
          → Simple path"
        </advanced>
        <expert>
          "Simple. {suspect_file}"
        </expert>
      </display>
      <route>step-02a-simple</route>
    </condition>
    <condition test="ELSE">
      <result>COMPLEX</result>
      <display level-adaptive="true">
        <beginner>
          "이건 좀 더 조사가 필요해 보여요. 🕵️

          아직 확실하지 않은 점:
          {unknowns}

          체계적으로 하나씩 확인해 볼게요.
          시간이 좀 걸릴 수 있지만, 이렇게 하면 확실히 해결할 수 있어요!"
        </beginner>
        <intermediate>
          "복잡한 버그입니다. 조사가 필요합니다.
          불확실: {unknowns}
          Complex path로 진행합니다."
        </intermediate>
        <advanced>
          "Complex. Investigation needed.
          Unknowns: {unknowns}"
        </advanced>
        <expert>
          "Complex. {unknowns}"
        </expert>
      </display>
      <route>step-02b-investigate</route>
    </condition>
  </decision>
</phase>

<phase n="4" name="Create Work Folder">
  <action>Create {sdd_root}/bug-{bug_name}/</action>
  <generate file="meta.yaml">
    type: bug
    title: "{bug_title}"
    created: "{date}"
    status: assessing
    symptoms: "{symptoms}"
    reproduce_steps: "{reproduce_steps}"
    expected_behavior: "{expected_behavior}"
    complexity: "{SIMPLE|COMPLEX}"
  </generate>
</phase>

</step-execution>
```

## Output

- Complexity decision (SIMPLE or COMPLEX)
- Bug folder created
- meta.yaml with initial info
- Route to next step

## Menu

```
[C] Continue - 결정된 경로로 진행
[X] 취소
```
