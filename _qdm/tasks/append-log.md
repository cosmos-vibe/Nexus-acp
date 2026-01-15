# Task: Append Log

> status.md에 로그 추가 (Append-only)

## Purpose

status.md의 로그 섹션에 새 항목을 추가합니다.
**중요: 기존 내용은 절대 수정하지 않습니다.**

## Input

| Parameter | Type | Description |
|-----------|------|-------------|
| status_file | path | status.md 파일 경로 |
| log_type | enum | work_log \| debug_log \| completion_notes |
| content | string | 추가할 내용 |
| date | string | 날짜 (기본: 오늘) |

## Execution

```xml
<task name="append-log">

<step n="1" name="Read File">
  <read>{status_file}</read>
  <store as="{original_content}"/>
  <validate>
    - File exists
    - Has expected sections
  </validate>
</step>

<step n="2" name="Locate Section">
  <find section_marker="{log_type}">
    work_log: "## Work Log"
    debug_log: "## Debug Log"
    completion_notes: "## Completion Notes"
  </find>
  <store section_start="{line_number}"/>
  <find next_section="## "/>
  <store section_end="{line_number} - 1"/>
</step>

<step n="3" name="Format Content">
  <format based_on="{log_type}">
    <if log_type="work_log">
      ### {date}

      {content}
    </if>
    <if log_type="debug_log">
      | {date} | {problem} | {attempt} | {result} |
    </if>
    <if log_type="completion_notes">
      - {content}
    </if>
  </format>
</step>

<step n="4" name="Insert Content">
  <insert at="{section_start + 1}">
    {formatted_content}
  </insert>
  <critical rule="APPEND_ONLY">
    - DO NOT modify any existing lines
    - Only INSERT new content
    - Preserve all original content exactly
  </critical>
</step>

<step n="5" name="Update Frontmatter">
  <update line="updated:">
    updated: "{current_date}"
  </update>
</step>

<step n="6" name="Validate and Write">
  <validate>
    - All original lines still present
    - New content added in correct location
    - No content removed or modified
  </validate>
  <if validation_fails>
    <abort>"Validation failed. Append-only rule violated."</abort>
  </if>
  <write>{status_file}</write>
</step>

</task>
```

## Work Log Format

```markdown
## Work Log

### 2026-01-09

**작업 내용:**
- T-1 완료: 로그인 폼 구현
- T-2 시작: API 연동

**메모:**
- 내일 토큰 저장 방식 결정 필요

### 2026-01-08

**작업 내용:**
- spec.md 완료
- plan.md 시작
```

## Debug Log Format

```markdown
## Debug Log

| 날짜 | 문제 | 시도 | 결과 |
|------|------|------|------|
| 2026-01-09 | 401 에러 발생 | 토큰 확인 | 만료됨 확인 |
| 2026-01-09 | 토큰 갱신 실패 | refresh API 호출 | 성공 |
| 2026-01-08 | 폼 제출 안됨 | 이벤트 확인 | preventDefault 누락 |
```

## Usage

```xml
<!-- Add to Work Log -->
<task-call name="append-log">
  <param name="status_file">{sdd_root}/feature-login/status.md</param>
  <param name="log_type">work_log</param>
  <param name="content">
    **작업 내용:**
    - T-1 완료: 로그인 폼 구현

    **메모:**
    - 내일 API 연동 시작
  </param>
</task-call>

<!-- Add to Debug Log -->
<task-call name="append-log">
  <param name="status_file">{sdd_root}/bug-api-error/status.md</param>
  <param name="log_type">debug_log</param>
  <param name="problem">401 에러 발생</param>
  <param name="attempt">토큰 확인</param>
  <param name="result">만료됨 확인</param>
</task-call>
```

## Critical Rules

1. **Append-only**: 절대로 기존 로그를 수정/삭제하지 않음
2. **Chronological**: 새 항목은 섹션 상단에 추가 (최신이 위)
3. **Validation**: 쓰기 전 원본 보존 검증
4. **Atomic**: 실패 시 전체 작업 취소

## Why Append-only?

- **실패 학습**: 모든 시행착오 기록 보존
- **추적성**: 언제 뭘 했는지 완전한 히스토리
- **신뢰성**: AI가 실수로 중요 정보 삭제 방지
- **팀 협업**: 누가 뭘 했는지 명확
