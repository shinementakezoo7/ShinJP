-- ============================================================================
-- MIGRATION 015: Populate Workplace Scenarios
-- ============================================================================
-- Realistic workplace dialogues and situations for SSW training
-- Covers common scenarios across all 14 sectors
-- Priority: High - Essential for practical language learning
-- ============================================================================

-- CAREGIVING SCENARIOS
-- ============================================================================
INSERT INTO workplace_scenarios (sector_id, scenario_title, situation_description, difficulty_level, participants, dialogue, vocabulary_focus, cultural_notes, learning_objectives) VALUES

-- Scenario 1: Morning Greeting and Assistance
('caregiving', '朝の挨拶と介助', 'Morning greeting and assisting an elderly resident with getting out of bed', 'beginner', ARRAY['介護士：田中', '利用者：佐藤さん'], 
'{"lines": [
  {"speaker": "田中", "japanese": "佐藤さん、おはようございます。", "reading": "さとうさん、おはようございます。", "english": "Good morning, Mr. Sato."},
  {"speaker": "佐藤さん", "japanese": "おはよう。", "reading": "おはよう。", "english": "Good morning."},
  {"speaker": "田中", "japanese": "今日もいい天気ですね。起きましょうか。", "reading": "きょうもいいてんきですね。おきましょうか。", "english": "It''s another nice day. Shall we get up?"},
  {"speaker": "佐藤さん", "japanese": "うん、お願いします。", "reading": "うん、おねがいします。", "english": "Yes, please."},
  {"speaker": "田中", "japanese": "では、ゆっくり起き上がりますよ。私が支えますね。", "reading": "では、ゆっくりおきあがりますよ。わたしがささえますね。", "english": "Alright, let''s sit up slowly. I''ll support you."},
  {"speaker": "田中", "japanese": "大丈夫ですか？痛いところはありませんか？", "reading": "だいじょうぶですか？いたいところはありませんか？", "english": "Are you okay? Does anything hurt?"},
  {"speaker": "佐藤さん", "japanese": "大丈夫です。ありがとう。", "reading": "だいじょうぶです。ありがとう。", "english": "I''m fine. Thank you."}
]}',
ARRAY['おはようございます', 'お願いします', 'ゆっくり', '支える', '大丈夫', '痛い'],
'Always greet residents warmly. Use respectful language (です・ます form). Explain each action before doing it.',
ARRAY['Use appropriate morning greetings', 'Explain care actions clearly', 'Check for pain or discomfort', 'Use respectful language with elderly']
),

-- Scenario 2: Meal Assistance
('caregiving', '食事介助', 'Assisting with lunch and checking for allergies', 'beginner',
ARRAY['介護士：山田', '利用者：鈴木さん'],
'{"lines": [
  {"speaker": "山田", "japanese": "鈴木さん、お昼の時間です。", "reading": "すずきさん、おひるのじかんです。", "english": "Ms. Suzuki, it''s lunchtime."},
  {"speaker": "鈴木さん", "japanese": "今日のメニューは何？", "reading": "きょうのめにゅーはなに？", "english": "What''s on the menu today?"},
  {"speaker": "山田", "japanese": "今日はお魚とお味噌汁です。", "reading": "きょうはおさかなとおみそしるです。", "english": "Today we have fish and miso soup."},
  {"speaker": "山田", "japanese": "アレルギーはありませんね？", "reading": "あれるぎーはありませんね？", "english": "You don''t have any allergies, right?"},
  {"speaker": "鈴木さん", "japanese": "ないです。いただきます。", "reading": "ないです。いただきます。", "english": "No, I don''t. Let''s eat."},
  {"speaker": "山田", "japanese": "ゆっくり召し上がってくださいね。", "reading": "ゆっくりめしあがってくださいね。", "english": "Please take your time eating."},
  {"speaker": "山田", "japanese": "飲み込みにくい時は教えてください。", "reading": "のみこみにくいときはおしえてください。", "english": "Please let me know if you have trouble swallowing."}
]}',
ARRAY['食事', 'メニュー', 'アレルギー', 'ゆっくり', '召し上がる', '飲み込む'],
'Always check for food allergies. Watch for swallowing difficulties (誤嚥 risk). Never rush meals.',
ARRAY['Announce meal times properly', 'Verify allergies before serving', 'Watch for aspiration risk', 'Use respectful eating verbs (召し上がる)']
),

-- Scenario 3: Emergency - Fall Prevention
('caregiving', '転倒予防', 'Preventing a fall in the hallway', 'intermediate',
ARRAY['介護士：中村', '利用者：田中さん'],
'{"lines": [
  {"speaker": "中村", "japanese": "田中さん、危ないです！", "reading": "たなかさん、あぶないです！", "english": "Mr. Tanaka, that''s dangerous!"},
  {"speaker": "田中さん", "japanese": "トイレに行きたいんだ。", "reading": "といれにいきたいんだ。", "english": "I want to go to the toilet."},
  {"speaker": "中村", "japanese": "わかりました。でも一人で歩くと転倒する危険があります。", "reading": "わかりました。でもひとりであるくとてんとうするきけんがあります。", "english": "I understand. But walking alone is dangerous - you might fall."},
  {"speaker": "中村", "japanese": "私が付き添いますから、一緒に行きましょう。", "reading": "わたしがつきそいますから、いっしょにいきましょう。", "english": "I''ll accompany you, so let''s go together."},
  {"speaker": "田中さん", "japanese": "すまないね。", "reading": "すまないね。", "english": "Sorry for the trouble."},
  {"speaker": "中村", "japanese": "いえいえ、気にしないでください。安全が一番大切ですから。", "reading": "いえいえ、きにしないでください。あんぜんがいちばんたいせつですから。", "english": "Not at all, don''t worry about it. Safety is most important."},
  {"speaker": "中村", "japanese": "次からはナースコールを押してくださいね。", "reading": "つぎからはなーすこーるをおしてくださいね。", "english": "Please press the nurse call button next time, okay?"}
]}',
ARRAY['危ない', '転倒', '付き添う', '一緒に', '安全', 'ナースコール'],
'Falls are the #1 accident in care facilities. Always accompany residents who are at risk. Encourage use of call buttons.',
ARRAY['Identify fall risks immediately', 'Offer assistance tactfully', 'Emphasize safety without scolding', 'Teach proper use of call systems']
),

-- Scenario 4: Medication Time
('caregiving', '服薬介助', 'Assisting with medication', 'intermediate',
ARRAY['介護士：小林', '利用者：山田さん'],
'{"lines": [
  {"speaker": "小林", "japanese": "山田さん、お薬の時間です。", "reading": "やまださん、おくすりのじかんです。", "english": "Mr. Yamada, it''s time for your medicine."},
  {"speaker": "山田さん", "japanese": "また薬か...何の薬？", "reading": "またくすりか...なんのくすり？", "english": "Medicine again... What kind?"},
  {"speaker": "小林", "japanese": "血圧のお薬と胃薬です。", "reading": "けつあつのおくすりといぐすりです。", "english": "Blood pressure medicine and stomach medicine."},
  {"speaker": "小林", "japanese": "お名前を確認させてください。山田太郎様ですね？", "reading": "おなまえをかくにんさせてください。やまだたろうさまですね？", "english": "Let me confirm your name. You''re Taro Yamada, correct?"},
  {"speaker": "山田さん", "japanese": "そうです。", "reading": "そうです。", "english": "That''s right."},
  {"speaker": "小林", "japanese": "では、お水と一緒にどうぞ。", "reading": "では、おみずといっしょにどうぞ。", "english": "Okay, please take them with water."},
  {"speaker": "小林", "japanese": "飲み込めましたか？お口の中を見せていただけますか？", "reading": "のみこめましたか？おくちのなかをみせていただけますか？", "english": "Did you swallow them? Could you show me inside your mouth?"}
]}',
ARRAY['服薬', '薬', '血圧', '確認する', '飲み込む', 'お口'],
'Always verify patient identity before giving medication. Check that medicine was swallowed (patients sometimes hide pills). Never skip this verification.',
ARRAY['Verify patient identity correctly', 'Explain what each medication is for', 'Confirm medication was swallowed', 'Use respectful language for body parts']
);

-- CONSTRUCTION SCENARIOS  
-- ============================================================================
INSERT INTO workplace_scenarios (sector_id, scenario_title, situation_description, difficulty_level, participants, dialogue, vocabulary_focus, cultural_notes, learning_objectives) VALUES

-- Scenario 1: Morning Safety Meeting (KY活動)
('construction', '朝礼とKY活動', 'Morning meeting and risk assessment activity', 'beginner',
ARRAY['職長：斎藤', '作業員：李さん', '作業員：陳さん'],
'{"lines": [
  {"speaker": "斎藤", "japanese": "おはようございます！", "reading": "おはようございます！", "english": "Good morning!"},
  {"speaker": "全員", "japanese": "おはようございます！", "reading": "おはようございます！", "english": "Good morning!"},
  {"speaker": "斎藤", "japanese": "今日の作業を確認します。二階の鉄筋工事です。", "reading": "きょうのさぎょうをかくにんします。にかいのてっきんこうじです。", "english": "Let''s confirm today''s work. We''ll be doing rebar work on the second floor."},
  {"speaker": "斎藤", "japanese": "今日の危険予知。高所作業なので転落に注意！", "reading": "きょうのきけんよち。こうしょさぎょうなのでてんらくにちゅうい！", "english": "Today''s hazard prediction: It''s work at heights, so watch out for falls!"},
  {"speaker": "全員", "japanese": "転落に注意！ヨシ！", "reading": "てんらくにちゅうい！よし！", "english": "Watch out for falls! Yoshi!"},
  {"speaker": "斎藤", "japanese": "安全帯の着用！", "reading": "あんぜんたいのちゃくよう！", "english": "Wear your safety harness!"},
  {"speaker": "全員", "japanese": "安全帯の着用！ヨシ！", "reading": "あんぜんたいのちゃくよう！よし！", "english": "Wear safety harness! Yoshi!"},
  {"speaker": "斎藤", "japanese": "それでは、安全に作業しましょう。お願いします！", "reading": "それでは、あんぜんにさぎょうしましょう。おねがいします！", "english": "Alright, let''s work safely. Let''s do this!"},
  {"speaker": "全員", "japanese": "お願いします！", "reading": "おねがいします！", "english": "Let''s do this!"}
]}',
ARRAY['朝礼', 'KY活動', '危険予知', '高所作業', '転落', '安全帯', 'ヨシ'],
'KY (Kiken Yochi) = danger prediction activity. The "Yoshi!" call-and-response confirms everyone understood. This ritual is taken very seriously.',
ARRAY['Participate in morning safety meetings', 'Learn KY activity call-and-response', 'Understand "Yoshi!" confirmation culture', 'Identify hazards for the day']
),

-- Scenario 2: Using Power Tools Safely
('construction', '電動工具の使用', 'Requesting and using power tools safely', 'intermediate',
ARRAY['職長：山本', '作業員：王さん'],
'{"lines": [
  {"speaker": "王", "japanese": "山本さん、電動ドリルを使ってもいいですか？", "reading": "やまもとさん、でんどうどりるをつかってもいいですか？", "english": "Mr. Yamamoto, may I use the power drill?"},
  {"speaker": "山本", "japanese": "どこで使いますか？", "reading": "どこでつかいますか？", "english": "Where will you use it?"},
  {"speaker": "王", "japanese": "あそこの壁に穴を開けます。", "reading": "あそこのかべにあなをあけます。", "english": "I''ll drill holes in that wall over there."},
  {"speaker": "山本", "japanese": "わかりました。でも、その前に確認してください。", "reading": "わかりました。でも、そのまえにかくにんしてください。", "english": "I see. But first, please check."},
  {"speaker": "山本", "japanese": "壁の中に配線がないか、図面を見ましたか？", "reading": "かべのなかにはいせんがないか、ずめんをみましたか？", "english": "Did you check the blueprints to see if there''s wiring inside the wall?"},
  {"speaker": "王", "japanese": "あ、まだです。すみません。", "reading": "あ、まだです。すみません。", "english": "Oh, not yet. Sorry."},
  {"speaker": "山本", "japanese": "電気や水道管があったら危険です。必ず図面を確認してから作業してください。", "reading": "でんきやすいどうかんがあったらきけんです。かならずずめんをかくにんしてからさぎょうしてください。", "english": "It''s dangerous if there are electrical wires or water pipes. Always check the blueprints before working."},
  {"speaker": "王", "japanese": "わかりました。気をつけます。", "reading": "わかりました。きをつけます。", "english": "Understood. I''ll be careful."}
]}',
ARRAY['電動工具', '穴を開ける', '配線', '図面', '水道管', '必ず', '確認する'],
'Always check for hidden utilities before drilling or cutting. Hitting electrical wires or pipes can be fatal. This is a critical safety practice.',
ARRAY['Request permission for power tool use', 'Check blueprints before drilling', 'Understand risks of hidden utilities', 'Accept corrections professionally']
);

-- Additional scenarios for other sectors would follow...
-- Showing structure for Food Service sector

-- FOOD SERVICE SCENARIOS
-- ============================================================================
INSERT INTO workplace_scenarios (sector_id, scenario_title, situation_description, difficulty_level, participants, dialogue, vocabulary_focus, cultural_notes, learning_objectives) VALUES

('food_service', '開店準備', 'Morning preparation before restaurant opens', 'beginner',
ARRAY['店長：田中', 'スタッフ：金さん'],
'{"lines": [
  {"speaker": "田中", "japanese": "おはようございます。今日もよろしくお願いします。", "reading": "おはようございます。きょうもよろしくおねがいします。", "english": "Good morning. Let''s do our best today."},
  {"speaker": "金", "japanese": "おはようございます。お願いします。", "reading": "おはようございます。おねがいします。", "english": "Good morning. Yes, let''s do this."},
  {"speaker": "田中", "japanese": "まず手を洗って、制服に着替えてください。", "reading": "まずてをあらって、せいふくにきがえてください。", "english": "First, wash your hands and change into your uniform."},
  {"speaker": "金", "japanese": "はい、わかりました。", "reading": "はい、わかりました。", "english": "Yes, understood."},
  {"speaker": "田中", "japanese": "それから、テーブルを拭いて、メニューを並べてください。", "reading": "それから、てーぶるをふいて、めにゅーをならべてください。", "english": "After that, wipe the tables and arrange the menus."},
  {"speaker": "金", "japanese": "調味料も補充しますか？", "reading": "ちょうみりょうもほじゅうしますか？", "english": "Should I also refill the condiments?"},
  {"speaker": "田中", "japanese": "はい、お願いします。開店は11時です。", "reading": "はい、おねがいします。かいてんは11じです。", "english": "Yes, please. We open at 11."}
]}',
ARRAY['手を洗う', '制服', '着替える', 'テーブルを拭く', 'メニュー', '調味料', '補充する', '開店'],
'Hygiene is extremely important in Japanese food service. Handwashing before work is mandatory.',
ARRAY['Follow opening procedures', 'Understand hygiene requirements', 'Learn restaurant vocabulary', 'Take initiative in preparation tasks']
);

COMMIT;

-- ============================================================================
-- END OF MIGRATION 015
-- ============================================================================
-- Total scenarios added: 7 scenarios across 3 sectors
-- Each scenario includes: dialogue, vocabulary, cultural notes, learning objectives
-- Remaining sectors to be populated in similar format
-- ============================================================================
