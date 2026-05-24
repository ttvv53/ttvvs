import { Word, Level, TranslationExercise } from '@/types/vocabulary';

export const cet6Words: Word[] = [
  {
    id: 'w001', word: 'abnormal', phonetic: { uk: '/æbˈnɔːml/', us: '/æbˈnɔːrml/' },
    partOfSpeech: [{ type: 'adj', meaning: '反常的；变态的' }],
    meanings: ['反常的，异常的；不正常的'],
    examples: [{ sentence: 'The abnormal weather conditions caused widespread damage.', translation: '异常的天气条件造成了大范围的破坏。' }],
    collocations: ['abnormal behavior', 'abnormal condition'], synonyms: ['unusual', 'irregular'], antonyms: ['normal'],
    category: 'memorize', difficulty: 2, frequency: 85, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w002', word: 'abolish', phonetic: { uk: '/əˈbɒlɪʃ/', us: '/əˈbɑːlɪʃ/' },
    partOfSpeech: [{ type: 'v', meaning: '废除；废止' }],
    meanings: ['废除，废止（法律、制度等）'],
    examples: [{ sentence: 'The government decided to abolish the outdated law.', translation: '政府决定废除这项过时的法律。' }],
    collocations: ['abolish a law', 'abolish a system'], synonyms: ['eliminate', 'cancel'], antonyms: ['establish'],
    category: 'spell', difficulty: 3, frequency: 78, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w003', word: 'abrupt', phonetic: { uk: '/əˈbrʌpt/', us: '/əˈbrʌpt/' },
    partOfSpeech: [{ type: 'adj', meaning: '突然的；唐突的' }],
    meanings: ['突然的，意外的；（行为）唐突的'],
    examples: [{ sentence: 'The meeting came to an abrupt end.', translation: '会议突然结束了。' }],
    collocations: ['abrupt change', 'abrupt manner'], synonyms: ['sudden', 'unexpected'], antonyms: ['gradual'],
    category: 'memorize', difficulty: 3, frequency: 72, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w004', word: 'absurd', phonetic: { uk: '/əbˈsɜːd/', us: '/əbˈsɜːrd/' },
    partOfSpeech: [{ type: 'adj', meaning: '荒谬的；可笑的' }],
    meanings: ['荒谬的，荒唐的；愚蠢的'],
    examples: [{ sentence: 'The idea seemed completely absurd.', translation: '这个想法似乎完全荒谬。' }],
    collocations: ['absurd idea', 'absurd situation'], synonyms: ['ridiculous', 'foolish'], antonyms: ['reasonable'],
    category: 'spell', difficulty: 3, frequency: 68, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w005', word: 'abundance', phonetic: { uk: '/əˈbʌndəns/', us: '/əˈbʌndəns/' },
    partOfSpeech: [{ type: 'n', meaning: '丰富；充裕' }],
    meanings: ['大量，丰富；充裕'],
    examples: [{ sentence: 'The country has an abundance of natural resources.', translation: '这个国家拥有丰富的自然资源。' }],
    collocations: ['in abundance', 'an abundance of'], synonyms: ['plenty', 'profusion'], antonyms: ['scarcity'],
    category: 'spell', difficulty: 3, frequency: 75, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w006', word: 'accelerate', phonetic: { uk: '/əkˈseləreɪt/', us: '/əkˈseləreɪt/' },
    partOfSpeech: [{ type: 'v', meaning: '加速；促进' }],
    meanings: ['（使）加速；（使）加快；促进'],
    examples: [{ sentence: 'The car began to accelerate down the hill.', translation: '汽车开始加速下山。' }],
    collocations: ['accelerate growth', 'accelerate development'], synonyms: ['speed up', 'hasten'], antonyms: ['decelerate'],
    category: 'spell', difficulty: 3, frequency: 82, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w007', word: 'accessible', phonetic: { uk: '/əkˈsesəbl/', us: '/əkˈsesəbl/' },
    partOfSpeech: [{ type: 'adj', meaning: '可接近的；可理解的' }],
    meanings: ['可接近的；可进入的；可理解的'],
    examples: [{ sentence: 'The library is accessible to all students.', translation: '图书馆对所有学生开放。' }],
    collocations: ['accessible to', 'easily accessible'], synonyms: ['available', 'approachable'], antonyms: ['inaccessible'],
    category: 'memorize', difficulty: 3, frequency: 88, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w008', word: 'accommodation', phonetic: { uk: '/ˌəkɒməˈdeɪʃn/', us: '/əˌkɑːməˈdeɪʃn/' },
    partOfSpeech: [{ type: 'n', meaning: '住宿；适应' }],
    meanings: ['住宿，膳宿；适应，调和'],
    examples: [{ sentence: 'We need to find accommodation for the night.', translation: '我们需要找今晚的住处。' }],
    collocations: ['find accommodation', 'provide accommodation'], synonyms: ['lodging', 'housing'], antonyms: [],
    category: 'spell', difficulty: 3, frequency: 90, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w009', word: 'accomplish', phonetic: { uk: '/əˈkʌmplɪʃ/', us: '/əˈkɑːmplɪʃ/' },
    partOfSpeech: [{ type: 'v', meaning: '完成；实现' }],
    meanings: ['完成，实现；达到'],
    examples: [{ sentence: 'We accomplished our goal ahead of schedule.', translation: '我们提前完成了目标。' }],
    collocations: ['accomplish a goal', 'accomplish a task'], synonyms: ['achieve', 'complete'], antonyms: ['fail'],
    category: 'spell', difficulty: 2, frequency: 92, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w010', word: 'accumulate', phonetic: { uk: '/əˈkjuːmjəleɪt/', us: '/əˈkjuːmjəleɪt/' },
    partOfSpeech: [{ type: 'v', meaning: '积累；积聚' }],
    meanings: ['积累，积聚；逐渐增加'],
    examples: [{ sentence: 'He managed to accumulate a fortune.', translation: '他设法积累了一笔财富。' }],
    collocations: ['accumulate wealth', 'accumulate experience'], synonyms: ['gather', 'collect'], antonyms: ['dissipate'],
    category: 'spell', difficulty: 3, frequency: 76, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w011', word: 'accurate', phonetic: { uk: '/ˈækjərət/', us: '/ˈækjərət/' },
    partOfSpeech: [{ type: 'adj', meaning: '准确的；精确的' }],
    meanings: ['准确的，精确的；正确无误的'],
    examples: [{ sentence: 'The data must be accurate.', translation: '数据必须准确。' }],
    collocations: ['accurate information', 'highly accurate'], synonyms: ['precise', 'correct'], antonyms: ['inaccurate'],
    category: 'spell', difficulty: 2, frequency: 95, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w012', word: 'achieve', phonetic: { uk: '/əˈtʃiːv/', us: '/əˈtʃiːv/' },
    partOfSpeech: [{ type: 'v', meaning: '实现；达到' }],
    meanings: ['实现，达到；完成'],
    examples: [{ sentence: 'He achieved his ambition of becoming a pilot.', translation: '他实现了成为飞行员的抱负。' }],
    collocations: ['achieve success', 'achieve a goal'], synonyms: ['accomplish', 'attain'], antonyms: ['fail'],
    category: 'spell', difficulty: 1, frequency: 98, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w013', word: 'acknowledge', phonetic: { uk: '/əkˈnɒlɪdʒ/', us: '/əkˈnɑːlɪdʒ/' },
    partOfSpeech: [{ type: 'v', meaning: '承认；确认' }],
    meanings: ['承认；确认收到；表示感谢'],
    examples: [{ sentence: 'He acknowledged his mistake.', translation: '他承认了自己的错误。' }],
    collocations: ['acknowledge a mistake', 'acknowledge receipt'], synonyms: ['admit', 'recognize'], antonyms: ['deny'],
    category: 'spell', difficulty: 3, frequency: 84, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w014', word: 'acquire', phonetic: { uk: '/əˈkwaɪə(r)/', us: '/əˈkwaɪər/' },
    partOfSpeech: [{ type: 'v', meaning: '获得；学到' }],
    meanings: ['获得，取得；学到（知识等）'],
    examples: [{ sentence: 'She acquired a good knowledge of French.', translation: '她掌握了很好的法语知识。' }],
    collocations: ['acquire knowledge', 'acquire skills'], synonyms: ['obtain', 'gain'], antonyms: ['lose'],
    category: 'spell', difficulty: 3, frequency: 86, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w015', word: 'adequate', phonetic: { uk: '/ˈædɪkwət/', us: '/ˈædɪkwət/' },
    partOfSpeech: [{ type: 'adj', meaning: '足够的；适当的' }],
    meanings: ['足够的，充分的；适当的'],
    examples: [{ sentence: 'We have adequate resources for the project.', translation: '我们有足够的资源来完成这个项目。' }],
    collocations: ['adequate supply', 'adequate preparation'], synonyms: ['sufficient', 'enough'], antonyms: ['inadequate'],
    category: 'spell', difficulty: 3, frequency: 78, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w016', word: 'adjust', phonetic: { uk: '/əˈdʒʌst/', us: '/əˈdʒʌst/' },
    partOfSpeech: [{ type: 'v', meaning: '调整；适应' }],
    meanings: ['调整，调节；适应'],
    examples: [{ sentence: 'You need to adjust the settings.', translation: '你需要调整设置。' }],
    collocations: ['adjust to', 'adjust the settings'], synonyms: ['adapt', 'modify'], antonyms: ['disturb'],
    category: 'spell', difficulty: 2, frequency: 88, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w017', word: 'admire', phonetic: { uk: '/ədˈmaɪə(r)/', us: '/ədˈmaɪər/' },
    partOfSpeech: [{ type: 'v', meaning: '钦佩；欣赏' }],
    meanings: ['钦佩，赞赏；欣赏'],
    examples: [{ sentence: 'I admire your courage.', translation: '我钦佩你的勇气。' }],
    collocations: ['admire someone for', 'greatly admire'], synonyms: ['respect', 'appreciate'], antonyms: ['despise'],
    category: 'memorize', difficulty: 2, frequency: 82, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w018', word: 'adopt', phonetic: { uk: '/əˈdɒpt/', us: '/əˈdɑːpt/' },
    partOfSpeech: [{ type: 'v', meaning: '采用；收养' }],
    meanings: ['采用，采纳；收养'],
    examples: [{ sentence: 'The committee adopted the proposal.', translation: '委员会采纳了这项提案。' }],
    collocations: ['adopt a policy', 'adopt a method'], synonyms: ['accept', 'embrace'], antonyms: ['reject'],
    category: 'spell', difficulty: 2, frequency: 85, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w019', word: 'advance', phonetic: { uk: '/ədˈvɑːns/', us: '/ədˈvæns/' },
    partOfSpeech: [{ type: 'v', meaning: '前进；促进' }, { type: 'n', meaning: '前进；进步' }],
    meanings: ['前进；进步；促进；预付'],
    examples: [{ sentence: 'Technology continues to advance rapidly.', translation: '技术继续快速进步。' }],
    collocations: ['in advance', 'advance the cause'], synonyms: ['progress', 'proceed'], antonyms: ['retreat'],
    category: 'spell', difficulty: 2, frequency: 90, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w020', word: 'advantage', phonetic: { uk: '/ədˈvɑːntɪdʒ/', us: '/ədˈvæntɪdʒ/' },
    partOfSpeech: [{ type: 'n', meaning: '优势；有利条件' }],
    meanings: ['优势，有利条件；利益'],
    examples: [{ sentence: 'This method has several advantages.', translation: '这种方法有几个优势。' }],
    collocations: ['take advantage of', 'have an advantage'], synonyms: ['benefit', 'edge'], antonyms: ['disadvantage'],
    category: 'spell', difficulty: 2, frequency: 94, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w021', word: 'advocate', phonetic: { uk: '/ˈædvəkeɪt/', us: '/ˈædvəkeɪt/' },
    partOfSpeech: [{ type: 'v', meaning: '提倡；支持' }, { type: 'n', meaning: '提倡者；支持者' }],
    meanings: ['提倡，主张；支持者'],
    examples: [{ sentence: 'He advocates for environmental protection.', translation: '他提倡环境保护。' }],
    collocations: ['advocate for', 'strong advocate'], synonyms: ['support', 'promote'], antonyms: ['oppose'],
    category: 'spell', difficulty: 4, frequency: 76, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w022', word: 'affect', phonetic: { uk: '/əˈfekt/', us: '/əˈfekt/' },
    partOfSpeech: [{ type: 'v', meaning: '影响；感动' }],
    meanings: ['影响；感动；（疾病）侵袭'],
    examples: [{ sentence: 'The decision will affect many people.', translation: '这个决定将影响许多人。' }],
    collocations: ['deeply affect', 'adversely affect'], synonyms: ['influence', 'impact'], antonyms: [],
    category: 'spell', difficulty: 2, frequency: 96, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w023', word: 'afford', phonetic: { uk: '/əˈfɔːd/', us: '/əˈfɔːrd/' },
    partOfSpeech: [{ type: 'v', meaning: '负担得起；提供' }],
    meanings: ['负担得起；提供，给予'],
    examples: [{ sentence: 'I can\'t afford to buy a new car.', translation: '我买不起新车。' }],
    collocations: ['can\'t afford', 'afford to do'], synonyms: ['manage', 'bear'], antonyms: [],
    category: 'spell', difficulty: 2, frequency: 92, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w024', word: 'aggressive', phonetic: { uk: '/əˈɡresɪv/', us: '/əˈɡresɪv/' },
    partOfSpeech: [{ type: 'adj', meaning: '侵略的；有进取心的' }],
    meanings: ['侵略的，好斗的；有进取心的'],
    examples: [{ sentence: 'His aggressive behavior caused problems.', translation: '他好斗的行为造成了问题。' }],
    collocations: ['aggressive behavior', 'aggressive strategy'], synonyms: ['hostile', 'forceful'], antonyms: ['passive'],
    category: 'memorize', difficulty: 3, frequency: 74, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w025', word: 'allocate', phonetic: { uk: '/ˈæləkeɪt/', us: '/ˈæləkeɪt/' },
    partOfSpeech: [{ type: 'v', meaning: '分配；拨出' }],
    meanings: ['分配，分派；拨出'],
    examples: [{ sentence: 'The government allocated funds for education.', translation: '政府为教育拨出了资金。' }],
    collocations: ['allocate resources', 'allocate funds'], synonyms: ['assign', 'distribute'], antonyms: [],
    category: 'spell', difficulty: 4, frequency: 72, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w026', word: 'alternative', phonetic: { uk: '/ɔːlˈtɜːnətɪv/', us: '/ɔːlˈtɜːrnətɪv/' },
    partOfSpeech: [{ type: 'n', meaning: '替代选择' }, { type: 'adj', meaning: '替代的' }],
    meanings: ['可供选择的事物；替代的'],
    examples: [{ sentence: 'We need to find an alternative solution.', translation: '我们需要找到一个替代方案。' }],
    collocations: ['alternative to', 'have no alternative'], synonyms: ['option', 'substitute'], antonyms: [],
    category: 'spell', difficulty: 3, frequency: 82, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w027', word: 'ambitious', phonetic: { uk: '/æmˈbɪʃəs/', us: '/æmˈbɪʃəs/' },
    partOfSpeech: [{ type: 'adj', meaning: '有雄心的；野心勃勃的' }],
    meanings: ['有雄心的，有抱负的；野心勃勃的'],
    examples: [{ sentence: 'She is an ambitious young woman.', translation: '她是一个有抱负的年轻女性。' }],
    collocations: ['ambitious plan', 'ambitious goal'], synonyms: ['aspiring', 'determined'], antonyms: ['unambitious'],
    category: 'spell', difficulty: 3, frequency: 78, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w028', word: 'analyze', phonetic: { uk: '/ˈænəlaɪz/', us: '/ˈænəlaɪz/' },
    partOfSpeech: [{ type: 'v', meaning: '分析' }],
    meanings: ['分析，解析'],
    examples: [{ sentence: 'We need to analyze the data carefully.', translation: '我们需要仔细分析数据。' }],
    collocations: ['analyze data', 'analyze the situation'], synonyms: ['examine', 'study'], antonyms: [],
    category: 'spell', difficulty: 2, frequency: 90, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w029', word: 'announce', phonetic: { uk: '/əˈnaʊns/', us: '/əˈnaʊns/' },
    partOfSpeech: [{ type: 'v', meaning: '宣布；宣告' }],
    meanings: ['宣布，宣告；通告'],
    examples: [{ sentence: 'They announced the winner of the competition.', translation: '他们宣布了比赛的获胜者。' }],
    collocations: ['announce a decision', 'officially announce'], synonyms: ['declare', 'proclaim'], antonyms: [],
    category: 'spell', difficulty: 2, frequency: 88, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w030', word: 'anticipate', phonetic: { uk: '/ænˈtɪsɪpeɪt/', us: '/ænˈtɪsɪpeɪt/' },
    partOfSpeech: [{ type: 'v', meaning: '预期；预料' }],
    meanings: ['预期，预料；期待'],
    examples: [{ sentence: 'We anticipate a large turnout.', translation: '我们预期会有很多人参加。' }],
    collocations: ['anticipate problems', 'anticipate change'], synonyms: ['expect', 'predict'], antonyms: [],
    category: 'spell', difficulty: 4, frequency: 76, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w031', word: 'apparent', phonetic: { uk: '/əˈpærənt/', us: '/əˈpærənt/' },
    partOfSpeech: [{ type: 'adj', meaning: '明显的；表面上的' }],
    meanings: ['明显的，显而易见的；表面上的'],
    examples: [{ sentence: 'It was apparent that he was lying.', translation: '很明显他在撒谎。' }],
    collocations: ['it became apparent', 'apparent reason'], synonyms: ['obvious', 'evident'], antonyms: ['hidden'],
    category: 'memorize', difficulty: 3, frequency: 74, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w032', word: 'appeal', phonetic: { uk: '/əˈpiːl/', us: '/əˈpiːl/' },
    partOfSpeech: [{ type: 'v', meaning: '呼吁；吸引' }, { type: 'n', meaning: '呼吁；吸引力' }],
    meanings: ['呼吁，请求；吸引；上诉'],
    examples: [{ sentence: 'The organization appealed for donations.', translation: '该组织呼吁捐款。' }],
    collocations: ['appeal to', 'appeal for'], synonyms: ['request', 'attract'], antonyms: ['repel'],
    category: 'spell', difficulty: 3, frequency: 78, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w033', word: 'appreciate', phonetic: { uk: '/əˈpriːʃieɪt/', us: '/əˈpriːʃieɪt/' },
    partOfSpeech: [{ type: 'v', meaning: '欣赏；感激；理解' }],
    meanings: ['欣赏，赏识；感激；理解'],
    examples: [{ sentence: 'I really appreciate your help.', translation: '我非常感谢你的帮助。' }],
    collocations: ['appreciate someone\'s help', 'greatly appreciate'], synonyms: ['value', 'admire'], antonyms: ['depreciate'],
    category: 'spell', difficulty: 3, frequency: 86, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w034', word: 'approach', phonetic: { uk: '/əˈprəʊtʃ/', us: '/əˈproʊtʃ/' },
    partOfSpeech: [{ type: 'v', meaning: '接近；处理' }, { type: 'n', meaning: '方法；接近' }],
    meanings: ['接近；处理；方法，途径'],
    examples: [{ sentence: 'We need a different approach to this problem.', translation: '我们需要用不同的方法来处理这个问题。' }],
    collocations: ['approach a problem', 'new approach'], synonyms: ['method', 'way'], antonyms: ['retreat'],
    category: 'spell', difficulty: 2, frequency: 92, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w035', word: 'appropriate', phonetic: { uk: '/əˈprəʊpriət/', us: '/əˈproʊpriət/' },
    partOfSpeech: [{ type: 'adj', meaning: '适当的；恰当的' }],
    meanings: ['适当的，恰当的'],
    examples: [{ sentence: 'Please wear appropriate clothing.', translation: '请穿着得体的服装。' }],
    collocations: ['appropriate for', 'appropriate action'], synonyms: ['suitable', 'fitting'], antonyms: ['inappropriate'],
    category: 'spell', difficulty: 3, frequency: 88, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w036', word: 'approve', phonetic: { uk: '/əˈpruːv/', us: '/əˈpruːv/' },
    partOfSpeech: [{ type: 'v', meaning: '批准；赞成' }],
    meanings: ['批准，认可；赞成'],
    examples: [{ sentence: 'The committee approved the plan.', translation: '委员会批准了该计划。' }],
    collocations: ['approve a plan', 'approve of'], synonyms: ['accept', 'endorse'], antonyms: ['disapprove'],
    category: 'spell', difficulty: 2, frequency: 84, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w037', word: 'arbitrary', phonetic: { uk: '/ˈɑːbɪtrəri/', us: '/ˈɑːrbɪtreri/' },
    partOfSpeech: [{ type: 'adj', meaning: '任意的；武断的' }],
    meanings: ['任意的，随意的；武断的'],
    examples: [{ sentence: 'The decision seemed arbitrary.', translation: '这个决定似乎是武断的。' }],
    collocations: ['arbitrary decision', 'arbitrary choice'], synonyms: ['random', 'capricious'], antonyms: ['systematic'],
    category: 'memorize', difficulty: 4, frequency: 68, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w038', word: 'arise', phonetic: { uk: '/əˈraɪz/', us: '/əˈraɪz/' },
    partOfSpeech: [{ type: 'v', meaning: '出现；产生' }],
    meanings: ['出现，发生；产生；起身'],
    examples: [{ sentence: 'Problems may arise during the process.', translation: '过程中可能会出现问题。' }],
    collocations: ['arise from', 'problems arise'], synonyms: ['emerge', 'appear'], antonyms: ['disappear'],
    category: 'spell', difficulty: 3, frequency: 76, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w039', word: 'artificial', phonetic: { uk: '/ˌɑːtɪˈfɪʃl/', us: '/ˌɑːrtɪˈfɪʃl/' },
    partOfSpeech: [{ type: 'adj', meaning: '人工的；人造的' }],
    meanings: ['人工的，人造的；虚假的'],
    examples: [{ sentence: 'Artificial intelligence is changing the world.', translation: '人工智能正在改变世界。' }],
    collocations: ['artificial intelligence', 'artificial light'], synonyms: ['synthetic', 'man-made'], antonyms: ['natural'],
    category: 'memorize', difficulty: 3, frequency: 82, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w040', word: 'assess', phonetic: { uk: '/əˈses/', us: '/əˈses/' },
    partOfSpeech: [{ type: 'v', meaning: '评估；评定' }],
    meanings: ['评估，评定；估算'],
    examples: [{ sentence: 'We need to assess the situation.', translation: '我们需要评估形势。' }],
    collocations: ['assess the situation', 'assess the impact'], synonyms: ['evaluate', 'judge'], antonyms: [],
    category: 'spell', difficulty: 3, frequency: 80, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w041', word: 'assign', phonetic: { uk: '/əˈsaɪn/', us: '/əˈsaɪn/' },
    partOfSpeech: [{ type: 'v', meaning: '分配；指派' }],
    meanings: ['分配，指派；指定'],
    examples: [{ sentence: 'The teacher assigned homework to the students.', translation: '老师给学生布置了作业。' }],
    collocations: ['assign a task', 'assign to'], synonyms: ['allocate', 'appoint'], antonyms: [],
    category: 'spell', difficulty: 2, frequency: 84, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w042', word: 'assist', phonetic: { uk: '/əˈsɪst/', us: '/əˈsɪst/' },
    partOfSpeech: [{ type: 'v', meaning: '帮助；协助' }],
    meanings: ['帮助，协助'],
    examples: [{ sentence: 'Can I assist you with anything?', translation: '我能帮您什么吗？' }],
    collocations: ['assist with', 'assist in'], synonyms: ['help', 'aid'], antonyms: ['hinder'],
    category: 'spell', difficulty: 2, frequency: 80, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w043', word: 'associate', phonetic: { uk: '/əˈsəʊsieɪt/', us: '/əˈsoʊsieɪt/' },
    partOfSpeech: [{ type: 'v', meaning: '联系；联想' }, { type: 'n', meaning: '同事；伙伴' }],
    meanings: ['联系，联想；伙伴，同事'],
    examples: [{ sentence: 'I associate this song with my childhood.', translation: '这首歌让我想起童年。' }],
    collocations: ['associate with', 'closely associated'], synonyms: ['connect', 'link'], antonyms: ['dissociate'],
    category: 'spell', difficulty: 3, frequency: 78, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w044', word: 'assume', phonetic: { uk: '/əˈsjuːm/', us: '/əˈsuːm/' },
    partOfSpeech: [{ type: 'v', meaning: '假定；承担' }],
    meanings: ['假定，假设；承担；认为'],
    examples: [{ sentence: 'Let\'s assume that the report is accurate.', translation: '让我们假设报告是准确的。' }],
    collocations: ['assume that', 'assume responsibility'], synonyms: ['suppose', 'presume'], antonyms: [],
    category: 'spell', difficulty: 3, frequency: 86, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w045', word: 'assure', phonetic: { uk: '/əˈʃʊə(r)/', us: '/əˈʃʊr/' },
    partOfSpeech: [{ type: 'v', meaning: '保证；使确信' }],
    meanings: ['保证，担保；使确信'],
    examples: [{ sentence: 'I assure you that everything is fine.', translation: '我向你保证一切都好。' }],
    collocations: ['assure someone that', 'rest assured'], synonyms: ['guarantee', 'promise'], antonyms: [],
    category: 'spell', difficulty: 3, frequency: 74, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w046', word: 'attach', phonetic: { uk: '/əˈtætʃ/', us: '/əˈtætʃ/' },
    partOfSpeech: [{ type: 'v', meaning: '附加；贴上' }],
    meanings: ['附加，贴上；依恋'],
    examples: [{ sentence: 'Please attach the file to the email.', translation: '请将文件附在电子邮件上。' }],
    collocations: ['attach to', 'attach importance'], synonyms: ['fasten', 'connect'], antonyms: ['detach'],
    category: 'spell', difficulty: 2, frequency: 76, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w047', word: 'attain', phonetic: { uk: '/əˈteɪn/', us: '/əˈteɪn/' },
    partOfSpeech: [{ type: 'v', meaning: '达到；获得' }],
    meanings: ['达到，获得'],
    examples: [{ sentence: 'He attained his goal through hard work.', translation: '他通过努力工作实现了目标。' }],
    collocations: ['attain a goal', 'attain success'], synonyms: ['achieve', 'reach'], antonyms: [],
    category: 'spell', difficulty: 3, frequency: 72, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w048', word: 'attempt', phonetic: { uk: '/əˈtempt/', us: '/əˈtempt/' },
    partOfSpeech: [{ type: 'v', meaning: '尝试；企图' }, { type: 'n', meaning: '尝试；企图' }],
    meanings: ['尝试，企图'],
    examples: [{ sentence: 'He attempted to solve the problem.', translation: '他试图解决这个问题。' }],
    collocations: ['attempt to', 'make an attempt'], synonyms: ['try', 'effort'], antonyms: [],
    category: 'spell', difficulty: 2, frequency: 84, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w049', word: 'attend', phonetic: { uk: '/əˈtend/', us: '/əˈtend/' },
    partOfSpeech: [{ type: 'v', meaning: '参加；照料' }],
    meanings: ['参加，出席；照料，照顾'],
    examples: [{ sentence: 'I will attend the meeting tomorrow.', translation: '我明天会参加会议。' }],
    collocations: ['attend a meeting', 'attend to'], synonyms: ['participate', 'go to'], antonyms: ['miss'],
    category: 'spell', difficulty: 2, frequency: 88, status: 'new', correctCount: 0, wrongCount: 0
  },
  {
    id: 'w050', word: 'attitude', phonetic: { uk: '/ˈætɪtjuːd/', us: '/ˈætɪtuːd/' },
    partOfSpeech: [{ type: 'n', meaning: '态度；看法' }],
    meanings: ['态度，看法；姿态'],
    examples: [{ sentence: 'She has a positive attitude towards life.', translation: '她对生活持积极态度。' }],
    collocations: ['attitude towards', 'positive attitude'], synonyms: ['outlook', 'perspective'], antonyms: [],
    category: 'spell', difficulty: 2, frequency: 90, status: 'new', correctCount: 0, wrongCount: 0
  }
];

export const levels: Level[] = [
  {
    id: 1, name: '入门闯关', description: '掌握最基础的六级高频词汇',
    wordIds: cet6Words.filter(w => w.difficulty <= 2).slice(0, 12).map(w => w.id),
    requiredScore: 80, reward: { badge: '初露锋芒', badgeIcon: '🌱', points: 100, title: '词汇新手' },
    unlocked: true, completed: false
  },
  {
    id: 2, name: '进阶挑战', description: '挑战中等难度词汇',
    wordIds: cet6Words.filter(w => w.difficulty === 3).slice(0, 12).map(w => w.id),
    requiredScore: 85, reward: { badge: '渐入佳境', badgeIcon: '🌿', points: 200, title: '词汇达人' },
    unlocked: false, completed: false
  },
  {
    id: 3, name: '高手之路', description: '攻克高难度词汇',
    wordIds: cet6Words.filter(w => w.difficulty >= 3).slice(0, 12).map(w => w.id),
    requiredScore: 90, reward: { badge: '登峰造极', badgeIcon: '🌳', points: 300, title: '词汇大师' },
    unlocked: false, completed: false
  },
  {
    id: 4, name: '终极考验', description: '综合测试所有词汇',
    wordIds: cet6Words.slice(0, 15).map(w => w.id),
    requiredScore: 95, reward: { badge: '一代宗师', badgeIcon: '🏆', points: 500, title: '词汇宗师' },
    unlocked: false, completed: false
  }
];

export const translationExercises: TranslationExercise[] = [
  {
    id: 't001', english: 'The government decided to abolish the outdated law.',
    chinese: '政府决定废除这项过时的法律。', keywords: ['abolish', 'government', 'law'],
    grammarPoints: ['decide to do', 'outdated'], difficulty: 2
  },
  {
    id: 't002', english: 'We need to analyze the data carefully before making a decision.',
    chinese: '我们需要在做决定之前仔细分析数据。', keywords: ['analyze', 'data', 'decision'],
    grammarPoints: ['need to do', 'before doing'], difficulty: 2
  },
  {
    id: 't003', english: 'She acquired a good knowledge of French through hard work.',
    chinese: '她通过努力工作掌握了很好的法语知识。', keywords: ['acquire', 'knowledge', 'French'],
    grammarPoints: ['acquire knowledge', 'through'], difficulty: 3
  },
  {
    id: 't004', english: 'The committee approved the plan after careful consideration.',
    chinese: '委员会经过仔细考虑后批准了该计划。', keywords: ['approve', 'committee', 'plan'],
    grammarPoints: ['after doing', 'careful consideration'], difficulty: 3
  },
  {
    id: 't005', english: 'Artificial intelligence is changing the way we live and work.',
    chinese: '人工智能正在改变我们生活和工作的方式。', keywords: ['artificial', 'intelligence', 'change'],
    grammarPoints: ['the way we do', 'live and work'], difficulty: 3
  },
  {
    id: 't006', english: 'We should appreciate the efforts of those who help us.',
    chinese: '我们应该感激那些帮助我们的人的努力。', keywords: ['appreciate', 'effort', 'help'],
    grammarPoints: ['should do', 'those who'], difficulty: 2
  },
  {
    id: 't007', english: 'The decision will affect not only the company but also its employees.',
    chinese: '这个决定不仅会影响公司，还会影响其员工。', keywords: ['affect', 'decision', 'employee'],
    grammarPoints: ['not only...but also', 'will do'], difficulty: 3
  },
  {
    id: 't008', english: 'He attained his goal through persistence and determination.',
    chinese: '他通过坚持和决心实现了自己的目标。', keywords: ['attain', 'goal', 'persistence'],
    grammarPoints: ['through doing', 'attain goal'], difficulty: 4
  }
];

export function getWordById(id: string): Word | undefined {
  return cet6Words.find(w => w.id === id);
}

export function getWordsByIds(ids: string[]): Word[] {
  return ids.map(id => getWordById(id)).filter((w): w is Word => w !== undefined);
}

export function filterWords(filter: Partial<{
  category: 'memorize' | 'spell';
  difficulty: number;
  status: string;
  search: string;
}>): Word[] {
  return cet6Words.filter(word => {
    if (filter.category && word.category !== filter.category) return false;
    if (filter.difficulty && word.difficulty !== filter.difficulty) return false;
    if (filter.status && word.status !== filter.status) return false;
    if (filter.search && !word.word.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });
}
