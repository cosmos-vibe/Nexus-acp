# Step 1: Initialize Feature

> 폴더 생성 및 초기화

## Goal

새 기능 작업을 위한 폴더와 메타데이터를 생성합니다.

## Execution

```xml
<step-execution>

<phase n="1" name="Get Feature Name">
  <check if="feature_name provided">
    <action>Use provided name</action>
  </check>
  <check if="feature_name not provided">
    <ask level-adaptive="true">
      <beginner>"새로 만들 기능의 이름을 알려주세요. 예: '로그인', '장바구니', '검색'"</beginner>
      <intermediate>"기능 이름? (폴더명으로 사용됩니다)"</intermediate>
      <advanced>"Feature name:"</advanced>
      <expert>"Name:"</expert>
    </ask>
    <validate>
      - 영문, 숫자, 하이픈만 허용
      - 공백은 하이픈으로 변환
      - 예: "로그인 기능" → "login-feature"
    </validate>
  </check>
</phase>

<phase n="2" name="Check Existing">
  <action>Check if {sdd_root}/feature-{feature_name}/ exists</action>
  <check if="exists">
    <action>Load meta.yaml</action>
    <ask>"이미 '{feature_name}' 작업이 있어요. 이어서 진행할까요?"</ask>
    <options>
      [Y] 이어서 진행 → Resume from stepsCompleted
      [N] 새로 시작 → Delete and recreate
      [C] 취소 → Return to menu
    </options>
  </check>
  <check if="not exists">
    <action>Proceed to create</action>
  </check>
</phase>

<phase n="3" name="Create Folder Structure">
  <action>Create {sdd_root}/feature-{feature_name}/</action>
  <verify>Folder created successfully</verify>
</phase>

<phase n="4" name="Load Profile">
  <action>Load {profile_path}</action>
  <extract>overall_level, skills, preferences</extract>
  <store>As {profile} for level-adaptive responses</store>
  <fallback if="file not found">
    <action>Use {skill_level} from config as default</action>
    <set>{profile}.overall_level = {skill_level}</set>
  </fallback>
</phase>

<phase n="5" name="Create meta.yaml">
  <action>Load template: {template_meta}</action>
  <fill>
    title: "{feature_name}"
    type: "feature"
    created: "{date}"
    updated: "{date}"
    status: "in-progress"
    priority: "medium"
    summary: ""
    goal: ""
    stepsCompleted: ["init"]
  </fill>
  <save>{default_output_folder}/meta.yaml</save>
</phase>

<phase n="6" name="Update Index">
  <action>Load {sdd_root}/index.yaml</action>
  <add to="active_work">
    feature-{feature_name}:
      type: feature
      title: "{feature_name}"
      status: in-progress
      created: "{date}"
      folder: "feature-{feature_name}"
  </add>
  <save>{sdd_root}/index.yaml</save>
</phase>

</step-execution>
```

## Output

- `{sdd_root}/feature-{feature_name}/meta.yaml` 생성됨
- `{sdd_root}/index.yaml` 업데이트됨
- `{profile}` 로드됨

## Next

자동으로 Step 2 (Requirement Research)로 진행합니다.

## Menu

```
[C] Continue - 다음 단계로 (요구사항 분석)
[S] Save & Pause - 저장 후 나중에 재개
```
