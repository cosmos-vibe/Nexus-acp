# Step 3: Root Cause Confirmation

> 근본 원인 확정 (Complex Path)

## Goal

조사 결과를 바탕으로 근본 원인을 확정하고 문서화합니다.

## Execution

```xml
<step-execution>

<phase n="1" name="Review Investigation">
  <action>Read status.md Investigation Log</action>
  <summarize>
    - Which hypotheses were confirmed
    - Which were ruled out
    - Key evidence found
  </summarize>
</phase>

<phase n="2" name="Confirm Root Cause">
  <display level-adaptive="true">
    <beginner>
      "조사 결과를 정리해 볼게요! 📋

      **확인된 것:**
      {confirmed_findings}

      **배제된 것:**
      {ruled_out}

      **근본 원인:**
      {root_cause_explanation}

      쉽게 말하면... {simple_explanation}

      이게 맞는 것 같나요?"
    </beginner>
    <intermediate>
      "Investigation summary:
      - Confirmed: {confirmed}
      - Ruled out: {ruled_out}

      Root cause: {root_cause}
      Evidence: {evidence}"
    </intermediate>
    <advanced>
      "Root cause: {root_cause}
      Evidence: {evidence_summary}"
    </advanced>
    <expert>
      "RC: {root_cause_short}"
    </expert>
  </display>
  <ask>"이 분석이 맞나요? [Y/N/R(재조사)]"</ask>
</phase>

<phase n="3" name="Document Root Cause">
  <update status.md section="Root Cause">
    ## Root Cause

    **원인:** {root_cause}

    **상세:**
    {detailed_explanation}

    **증거:**
    - {evidence_1}
    - {evidence_2}
    - {evidence_3}

    **영향 범위:**
    - 파일: {affected_files}
    - 기능: {affected_features}
    - 사용자: {affected_users}

    **왜 발생했는가:**
    {why_it_happened}
  </update>
</phase>

<phase n="4" name="Assess Impact">
  <display level-adaptive="true">
    <beginner>
      "이 버그가 어디까지 영향을 주는지 확인해요:

      **영향받는 파일:**
      {affected_files_list}

      **영향받는 기능:**
      {affected_features_list}

      고칠 때 이것들을 고려해야 해요."
    </beginner>
    <intermediate>
      "Impact:
      - Files: {affected_files}
      - Features: {affected_features}"
    </intermediate>
    <advanced>
      "Impact: {files_count} files, {features_list}"
    </advanced>
    <expert>
      "Impact: {impact_summary}"
    </expert>
  </display>
</phase>

<phase n="5" name="Update meta.yaml">
  <update meta.yaml>
    status: root-cause-confirmed
    root_cause: "{root_cause}"
    affected_files: [{files}]
    affected_features: [{features}]
    stepsCompleted: ["assess", "investigate", "root-cause"]
  </update>
</phase>

</step-execution>
```

## Root Cause Documentation Template

```markdown
## Root Cause

**원인:** [한 줄 요약]

**상세:**
[상세한 기술적 설명]

**증거:**
- [증거 1]
- [증거 2]

**영향 범위:**
- 파일: [파일 목록]
- 기능: [기능 목록]

**왜 발생했는가:**
[근본적인 이유 - 설계 결함, 잘못된 가정, 외부 변경 등]
```

## Output

- Root Cause 섹션 완성
- meta.yaml 업데이트
- 영향 범위 파악

## Next

Step 4 (Plan Fix)로 진행합니다.

## Menu

```
[A] Advanced Elicitation - 원인 더 깊이 파악
[P] Party Mode - 다른 관점에서 검증
[C] Continue - 수정 계획으로 (step-04)
[R] Re-investigate - 다시 조사
```
