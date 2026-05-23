# 测评记录变量表

本文档说明网页和后台实际保存、查询、导出的数据变量。受测者页面不展示听力环境检测明细和每次“听到/没听到”明细；这些明细会写入后台数据、D1 查询表和 CSV 导出文件。

## 查看与导出位置

- 网页后台查看：打开网页左上角菜单，进入「后台」，输入后台密码后可刷新、选择单条记录查看测评详情。
- 网页后台导出：在「后台」点击「导出 CSV」，会导出所有已保存测评；听力环境和听力逐次反应在 `hearing_environment_checks_json`、`hearing_events_json`、`hearing_screening_json` 中，完成后问卷在 `post_test_survey_json` 中。
- 本地开发查看：`data/sessions.json` 保存本地 JSON 会话。
- Cloudflare D1 查询：`sessions` 保存会话汇总和精简 `payload_json`，其中 `payload_json.postTestSurvey` 保存 SUS 和 NASA-TLX；`item_responses` 保存认知题目明细、画图图片和语音题音频，`hearing_events` 保存听力环境检测、声道检查、练习和正式测试每次反应。

示例查询：

```sql
SELECT session_id, event_type, phase, ear, frequency_hz, level_db_hl, heard,
       response_label, environment_status, relative_db, event_at, reaction_ms
FROM hearing_events
ORDER BY event_at;
```

## 会话变量

| 变量名 | 变量说明 | 单位 |
|---|---|---|
| `session_id` / `id` | 单次测评会话唯一编号 | 无 |
| `case_number` / `participant.caseNumber` | 病例号 | 无 |
| `participant_name` | 参加者姓名 | 无 |
| `birth_year` | 出生年份；新版登记页不再要求填写，通常为空 | 年 |
| `participant_age` / `participant.ageAtTest` | 测评时年龄；新版登记页不再要求填写，通常为空 | 岁 |
| `gender` | 性别；新版登记页不再要求填写，通常为空 | 无 |
| `education_level` | 教育水平 | 无 |
| `targetAgeEligible` | 是否满足 60 岁及以上目标人群 | 布尔值 |
| `session_started_at` / `started_at` | 会话开始时间 | ISO 8601 时间 |
| `session_finished_at` / `finished_at` | 会话结束时间 | ISO 8601 时间 |
| `saved_at` | 保存到后台的时间 | ISO 8601 时间 |
| `total_duration_ms` | 总测评用时 | 毫秒 |
| `raw_score` | MoCA 原始得分 | 分 |
| `education_bonus` | 教育加分 | 分 |
| `total_score` | 加教育分后的总分 | 分 |
| `risk_band` | 认知风险分层 | 无 |
| `domain_scores_json` | 各认知域得分 JSON | JSON |
| `payload_json` | 会话汇总 JSON；题目完整答案见 `item_responses.answer_json` | JSON |
| `storageMode` | 数据存储方式，如 `cloudflare-d1`、`browser-local` | 无 |
| `ttsManifestVersion` | 本地语音包清单版本 | 无 |

## 听力初筛变量

| 变量名 | 变量说明 | 单位 |
|---|---|---|
| `hearing_status` / `hearingScreening.summary.status` | 听力初筛状态：`pass`、`refer`、`incomplete`、`skipped` | 无 |
| `hearingScreening.protocolVersion` | 听力测试协议版本 | 无 |
| `hearingScreening.startedAt` | 听力测试开始时间 | ISO 8601 时间 |
| `hearingScreening.finishedAt` | 听力测试完成时间 | ISO 8601 时间 |
| `hearing_right_pta4` / `summary.ears.right.pta4` | 右耳 500/1000/2000/4000 Hz 平均听阈 | dB HL |
| `hearing_left_pta4` / `summary.ears.left.pta4` | 左耳 500/1000/2000/4000 Hz 平均听阈 | dB HL |
| `hearing_worse_ear` / `summary.worseEar` | 较差耳：`right`、`left`、`equal` | 无 |
| `summary.worsePta4` | 较差耳四频平均听阈 | dB HL |
| `hearing_moca_audio_level` / `summary.mocaAudioLevelDbHl` | 后续 MoCA 语音播放建议声级 | dB HL |
| `summary.mocaAudioOffsetDb` | MoCA 语音相对较差耳听阈的补偿量 | dB |
| `summary.primaryFrequenciesHz` | PTA 计算频率列表 | Hz |
| `summary.testFrequenciesHz` | 正式测试频率列表 | Hz |
| `summary.levelsDbHl` | 正式测试声强阶梯 | dB HL |
| `thresholds.{ear}.{frequencyHz}.thresholdDbHl` | 某耳某频率记录听阈 | dB HL |
| `thresholds.{ear}.{frequencyHz}.noResponseAtMax` | 最大声强仍未听到 | 布尔值 |
| `thresholds.{ear}.{frequencyHz}.recordedAt` | 听阈记录时间 | ISO 8601 时间 |
| `hearing_response_count` / `responseCounts.total` | 练习和正式测试总反应次数 | 次 |
| `hearing_heard_count` / `responseCounts.heard` | 选择“听到了”的次数 | 次 |
| `hearing_missed_count` / `responseCounts.missed` | 选择“没听到”的次数 | 次 |
| `responseCounts.practiceTotal` | 练习反应次数 | 次 |
| `responseCounts.testTotal` | 正式测试反应次数 | 次 |
| `responseCounts.testFinalFrequencies` | 已形成最终听阈的频率数 | 个 |
| `hearing_screening_json` | 完整听力初筛 JSON | JSON |

## 听力环境检测变量

| 变量名 | 变量说明 | 单位 |
|---|---|---|
| `hearing_environment_status` / `environment.status` | 环境检测状态：`quiet`、`noisy`、`unavailable`、`checking`、`not_checked` | 无 |
| `hearing_environment_relative_db` / `environment.relativeDb` | 环境麦克风相对噪声均值，非校准 dB(A) | relative dBFS |
| `environment.averageRelativeDb` | 环境相对噪声平均值 | relative dBFS |
| `environment.peakRelativeDb` | 环境相对噪声峰值 | relative dBFS |
| `environment.sampleCount` | 环境采样次数 | 次 |
| `environment.durationMs` | 环境采样时长 | 毫秒 |
| `environment.quietThresholdRelativeDb` | 判定“环境较安静”的相对阈值 | relative dBFS |
| `environment.checkedAt` | 环境检测完成时间 | ISO 8601 时间 |
| `environment.method` | 环境检测方法 | 无 |
| `environment.reason` | 无法检测时的原因 | 无 |
| `environment.note` | 环境检测备注 | 无 |
| `environmentChecks[].id` | 单次环境检测事件编号 | 无 |
| `environmentChecks[].startedAt` | 单次环境检测开始时间 | ISO 8601 时间 |
| `environmentChecks[].endedAt` | 单次环境检测结束时间 | ISO 8601 时间 |
| `hearing_environment_checks_json` | 所有环境检测尝试 JSON | JSON |

## 听力逐次事件变量

| 变量名 | 变量说明 | 单位 |
|---|---|---|
| `hearingScreening.events[].sequence` | 听力事件顺序号 | 次序 |
| `hearingScreening.events[].id` | 听力事件编号 | 无 |
| `hearingScreening.events[].eventType` / `hearing_events.event_type` | 事件类型：`environment_check`、`channel_check`、`practice_response`、`test_response` | 无 |
| `hearingScreening.events[].phase` / `phase` | 所属阶段：`intro`、`channel`、`practice`、`test` | 无 |
| `hearingScreening.events[].ear` / `ear` | 测试耳：`right`、`left` | 无 |
| `hearingScreening.events[].earLabel` | 测试耳中文标签 | 无 |
| `hearingScreening.events[].frequencyHz` / `frequency_hz` | 测试频率 | Hz |
| `hearingScreening.events[].levelDbHl` / `level_db_hl` | 播放声强 | dB HL |
| `hearingScreening.events[].heard` / `heard` | 是否选择“听到了” | 布尔值 / 0-1 |
| `hearingScreening.events[].responseLabel` / `response_label` | 中文反应标签，如“听到了”“没听到” | 无 |
| `hearingScreening.events[].source` | 反应来源，默认 `button` | 无 |
| `hearingScreening.events[].trialIndex` | 正式测试频率试次索引 | 次序 |
| `hearingScreening.events[].attemptIndex` | 同一耳同一频率下的声强尝试序号 | 次序 |
| `hearingScreening.events[].practiceIndex` | 练习试次索引 | 次序 |
| `hearingScreening.events[].channelCheckIndex` | 声道检查索引 | 次序 |
| `hearingScreening.events[].primary` | 是否纳入四频 PTA 计算 | 布尔值 |
| `hearingScreening.events[].finalForFrequency` | 是否为该耳该频率最终判定反应 | 布尔值 |
| `hearingScreening.events[].toneStartedAt` | 测试音开始播放时间 | ISO 8601 时间 |
| `hearingScreening.events[].toneEndedAt` | 测试音结束播放时间 | ISO 8601 时间 |
| `hearingScreening.events[].toneDurationMs` | 测试音实际播放时长 | 毫秒 |
| `hearingScreening.events[].responseAt` / `event_at` | 用户作答时间 | ISO 8601 时间 |
| `hearingScreening.events[].reactionMs` / `reaction_ms` | 测试音结束到用户作答的间隔 | 毫秒 |
| `hearingScreening.events[].environmentStatus` / `environment_status` | 环境事件的检测状态 | 无 |
| `hearingScreening.events[].relativeDb` / `relative_db` | 环境事件相对噪声值 | relative dBFS |
| `hearing_events_json` | 环境、声道、练习、正式测试全部听力事件 JSON | JSON |

## 完成后问卷变量

| 变量名 | 变量说明 | 单位 |
|---|---|---|
| `post_test_survey_status` / `postTestSurvey.status` | 问卷状态：`not_started`、`in_progress`、`completed` | 无 |
| `post_test_survey_started_at` / `postTestSurvey.startedAt` | 问卷开始时间 | ISO 8601 时间 |
| `post_test_survey_completed_at` / `postTestSurvey.completedAt` | 问卷完成时间 | ISO 8601 时间 |
| `postTestSurvey.responses[]` | 16 道问卷逐题答案，含量表、题干、分值、标签和作答时间 | JSON |
| `postTestSurvey.responses[].instrument` | 问卷类型：`sus` 或 `nasa-tlx` | 无 |
| `postTestSurvey.responses[].value` | SUS 为 1-5 分，NASA-TLX 为 0-100 分 | 分 |
| `sus_score` / `postTestSurvey.scores.susScore` | SUS 标准总分 | 0-100 |
| `sus_raw_score` / `postTestSurvey.scores.susRaw` | SUS 原始换算前总分 | 0-40 |
| `nasa_tlx_raw_score` / `postTestSurvey.scores.nasaTlxRawScore` | NASA-TLX 6 个维度原始均分 | 0-100 |
| `post_test_survey_json` | 完整 SUS 和 NASA-TLX 问卷 JSON | JSON |

## 认知题目变量

| 变量名 | 变量说明 | 单位 |
|---|---|---|
| `task_id` / `taskId` | 题目编号 | 无 |
| `task_title` / `title` | 题目名称 | 无 |
| `domain` | 认知域 | 无 |
| `modality` | 作答形式 | 无 |
| `max_score` / `maxScore` | 题目满分 | 分 |
| `score` | 题目得分 | 分 |
| `item_started_at` / `startedAt` | 题目开始时间 | ISO 8601 时间 |
| `item_ended_at` / `endedAt` | 题目结束时间 | ISO 8601 时间 |
| `item_duration_ms` / `durationMs` | 题目用时 | 毫秒 |
| `standard_answer` | 标准答案摘要 | 无 |
| `user_answer` | 用户答案摘要 | 无 |
| `correctness_json` | 分项正确性 JSON | JSON |
| `answer_json` | 题目答案 JSON；选择题保存所选选项/序列，语音题保存转写文本和 `audioRecordings` 原始音频 data URL | JSON |
| `behavior_json` | 行为过程 JSON，如连线、撤销、敲击、语音事件、定位等 | JSON |
| `ai_json` | AI 评分结果 JSON | JSON |
| `drawing_image` | 画图/连线题保存的图片 data URL | data URL |
| `has_drawing` | 是否有画图图片 | 0-1 |
| `answer_json.audioRecordings` | 句子复述、动物词语流畅性等语音题答题音频，按步骤保存为 `data:audio/...;base64,...` | data URL |
