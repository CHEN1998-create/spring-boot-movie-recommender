package cn.filmisle.bootstrap;

import cn.filmisle.movie.Movie;
import cn.filmisle.movie.MovieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * 种子数据与海报迁移：数据库为空时导入 18 部影片（与前端 data/movies.ts 同源，保证演示一致）；
 * 启动时将旧版外部文生图海报 URL 迁移为本地静态路径。
 */
@Component
public class MovieSeeder implements CommandLineRunner {

    private final MovieRepository movieRepository;

    public MovieSeeder(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public void run(String... args) {
        migrateLegacyPosterUrls();
        if (movieRepository.count() > 0) {
            return;
        }
        LocalDateTime now = LocalDateTime.now();
        for (int i = 0; i < SEEDS.size(); i++) {
            Object[] s = SEEDS.get(i);
            Movie m = new Movie();
            m.setTitle((String) s[0]);
            m.setOriginalTitle((String) s[1]);
            m.setYear((Integer) s[2]);
            m.setDuration((Integer) s[3]);
            m.setDirector((String) s[4]);
            m.setCastNames((String) s[5]);
            m.setRegion((String) s[6]);
            m.setSummary((String) s[7]);
            m.replaceTags(Arrays.asList(((String) s[8]).split("/")));
            m.setRating(java.math.BigDecimal.valueOf((Double) s[9]));
            m.setRatingCount((Long) s[10]);
            m.setPosterUrl("/posters/poster-" + (i + 1) + ".jpg");
            m.setCreatedAt(now.minusDays(SEEDS.size() - i));
            movieRepository.save(m);
        }
    }

    /**
     * 一次性迁移：旧版海报使用外部文生图 URL，加载慢且服务不稳定。
     * 启动时将种子影片的外部 URL 替换为本地静态路径（幂等，仅处理仍指向外部服务的记录）。
     */
    private void migrateLegacyPosterUrls() {
        for (Movie m : movieRepository.findAll()) {
            String url = m.getPosterUrl();
            if (url == null || !url.contains("trae-api-cn.mchost.guru")) {
                continue;
            }
            String local = LOCAL_POSTERS.get(m.getTitle());
            if (local != null) {
                m.setPosterUrl(local);
                movieRepository.save(m);
            }
        }
    }

    /** 种子影片片名 → 本地海报路径（图片位于 frontend/public/posters/） */
    private static final Map<String, String> LOCAL_POSTERS = Map.ofEntries(
        Map.entry("星际穿越", "/posters/poster-1.jpg"),
        Map.entry("盗梦空间", "/posters/poster-2.jpg"),
        Map.entry("千与千寻", "/posters/poster-3.jpg"),
        Map.entry("寄生虫", "/posters/poster-4.jpg"),
        Map.entry("流浪地球", "/posters/poster-5.jpg"),
        Map.entry("肖申克的救赎", "/posters/poster-6.jpg"),
        Map.entry("让子弹飞", "/posters/poster-7.jpg"),
        Map.entry("疯狂动物城", "/posters/poster-8.jpg"),
        Map.entry("头号玩家", "/posters/poster-9.jpg"),
        Map.entry("隐入尘烟", "/posters/poster-10.jpg"),
        Map.entry("沙丘", "/posters/poster-11.jpg"),
        Map.entry("白日梦想家", "/posters/poster-12.jpg"),
        Map.entry("看不见的客人", "/posters/poster-13.jpg"),
        Map.entry("怦然心动", "/posters/poster-14.jpg"),
        Map.entry("信条", "/posters/poster-15.jpg"),
        Map.entry("完美的日子", "/posters/poster-16.jpg"),
        Map.entry("蜘蛛侠：纵横宇宙", "/posters/poster-17.jpg"),
        Map.entry("奥本海默", "/posters/poster-18.jpg")
    );

    /** [title, originalTitle, year, duration, director, cast, region, summary, tags, rating, ratingCount] */
    private static final List<Object[]> SEEDS = List.of(
        new Object[]{ "星际穿越", "Interstellar", 2014, 169, "克里斯托弗·诺兰", "马修·麦康纳 / 安妮·海瑟薇 / 杰西卡·查斯坦",
            "美国 / 英国",
            "在不远的未来，地球粮食危机蔓延，前宇航员库珀受命穿越虫洞，为人类寻找新的家园。爱与引力，是唯一能跨越维度的语言。",
            "科幻/冒险/剧情", 9.4, 12846L },
        new Object[]{ "盗梦空间", "Inception", 2010, 148, "克里斯托弗·诺兰", "莱昂纳多·迪卡普里奥 / 约瑟夫·高登-莱维特 / 艾伦·佩吉",
            "美国 / 英国",
            "造梦师柯布率领团队潜入层层梦境执行\"植入\"任务，梦境越深，时间越慢，而他的内心秘密也步步逼近。",
            "科幻/悬疑/动作", 9.3, 15602L },
        new Object[]{ "千与千寻", "千と千尋の神隠し", 2001, 125, "宫崎骏", "柊瑠美 / 入野自由 / 夏木真理",
            "日本",
            "少女千寻误入神灵世界的汤屋，为了拯救变成猪的父母，她在光怪陆离的世界里打工、成长，记住了自己的名字。",
            "动画/奇幻/冒险", 9.4, 18234L },
        new Object[]{ "寄生虫", "기생충", 2019, 132, "奉俊昊", "宋康昊 / 李善均 / 曹如晶",
            "韩国",
            "底层的金家四口一步步\"寄生\"进富豪朴家，一场暴雨之夜，两个家庭、两个阶层的裂痕轰然崩塌。",
            "剧情/悬疑/惊悚", 8.8, 11987L },
        new Object[]{ "流浪地球", "The Wandering Earth", 2019, 125, "郭帆", "屈楚萧 / 吴京 / 李光洁",
            "中国大陆",
            "太阳急速膨胀，人类在地球表面建造万座行星发动机，推动地球踏上流浪之旅。饱和式救援，是刻进骨子里的浪漫。",
            "科幻/灾难/剧情", 8.0, 9876L },
        new Object[]{ "肖申克的救赎", "The Shawshank Redemption", 1994, 142, "弗兰克·德拉邦特", "蒂姆·罗宾斯 / 摩根·弗里曼",
            "美国",
            "银行家安迪蒙冤入狱，用二十年凿开一条通往自由的隧道。有些鸟儿注定关不住，因为它们的每一片羽毛都闪着自由的光辉。",
            "剧情/犯罪", 9.7, 23150L },
        new Object[]{ "让子弹飞", "Let the Bullets Fly", 2010, 132, "姜文", "姜文 / 葛优 / 周润发",
            "中国大陆 / 香港",
            "土匪张麻子摇身变县长，与恶霸黄四郎在鹅城斗智斗勇。让子弹飞一会儿——站着，也能把钱挣了。",
            "剧情/喜剧/历史", 9.0, 13421L },
        new Object[]{ "疯狂动物城", "Zootopia", 2016, 108, "拜伦·霍华德", "金妮弗·古德温 / 杰森·贝特曼",
            "美国",
            "兔子朱迪成为动物城第一位警官，与狐狸尼克联手侦破失踪案。在这里，任何动物都有无限可能。",
            "动画/喜剧/冒险", 9.2, 15023L },
        new Object[]{ "头号玩家", "Ready Player One", 2018, 140, "史蒂文·斯皮尔伯格", "泰尔·谢里丹 / 奥利维亚·库克",
            "美国",
            "2045 年，人们沉溺于虚拟世界\"绿洲\"。少年韦德解开创始人留下的三把钥匙之谜，在彩蛋与危机之间拯救现实。",
            "科幻/冒险/动作", 8.5, 8764L },
        new Object[]{ "隐入尘烟", "Return to Dust", 2022, 133, "李睿珺", "武仁林 / 海清",
            "中国大陆",
            "西北农村，两个被各自家庭抛弃的孤独个体，在日复一日的劳作中相濡以沫。土地长出粮食，也长出笨拙而深沉的爱。",
            "剧情/文艺", 8.4, 5432L },
        new Object[]{ "沙丘", "Dune", 2021, 155, "丹尼斯·维伦纽瓦", "提莫西·查拉梅 / 丽贝卡·弗格森 / 赞达亚",
            "美国",
            "厄崔迪家族接管沙漠星球厄拉科斯，少年保罗在香料、沙虫与阴谋之间，逐步走向命运预见的未来。",
            "科幻/冒险", 8.2, 9210L },
        new Object[]{ "白日梦想家", "The Secret Life of Walter Mitty", 2013, 114, "本·斯蒂勒", "本·斯蒂勒 / 克里斯汀·韦格",
            "美国",
            "爱做白日梦的底片管理员为寻找\"第 25 号底片\"踏上环球之旅，从格陵兰到喜马拉雅，把幻想活成了现实。",
            "剧情/喜剧/冒险", 8.6, 7654L },
        new Object[]{ "看不见的客人", "Contratiempo", 2016, 106, "奥里奥尔·保罗", "马里奥·卡萨斯 / 阿娜·瓦格纳",
            "西班牙",
            "企业家艾德里安被控杀人，金牌女律师连夜赶来梳理证词。每一次陈述都是一次反转，直到最后一张牌翻开。",
            "悬疑/惊悚/犯罪", 8.8, 10234L },
        new Object[]{ "怦然心动", "Flipped", 2010, 90, "罗伯·莱纳", "玛德琳·卡罗尔 / 卡兰·麦克奥利菲",
            "美国",
            "朱莉从梧桐树上看见整片风景，也看见了布莱斯眼中的怯懦。斯人若彩虹，遇上方知有。",
            "剧情/喜剧/爱情", 9.1, 14520L },
        new Object[]{ "信条", "Tenet", 2020, 150, "克里斯托弗·诺兰", "约翰·大卫·华盛顿 / 罗伯特·帕丁森",
            "美国 / 英国",
            "一项关乎时间逆转的绝密任务，子弹倒飞、汽车复原，主角必须在正向与逆向世界里同时阻止第三次世界大战。",
            "科幻/动作/悬疑", 7.8, 6543L },
        new Object[]{ "完美的日子", "Perfect Days", 2023, 123, "维姆·文德斯", "役所广司",
            "日本 / 德国",
            "东京公厕清洁工平山过着秩序井然的日子：工作、拍树影、听磁带、读小说。木漏れ日の下，日常本身即是圆满。",
            "剧情/文艺", 8.5, 4321L },
        new Object[]{ "蜘蛛侠：纵横宇宙", "Spider-Man: Across the Spider-Verse", 2023, 140, "华金·多斯·桑托斯", "沙梅克·摩尔 / 海莉·斯坦菲尔德",
            "美国",
            "迈尔斯闯入蜘蛛联盟总部，面对整个多元宇宙的\"既定剧本\"，他偏要撕开命运的裂缝，走出自己的那一格。",
            "动画/动作/科幻", 8.9, 8877L },
        new Object[]{ "奥本海默", "Oppenheimer", 2023, 180, "克里斯托弗·诺兰", "基里安·墨菲 / 艾米莉·布朗特 / 小罗伯特·唐尼",
            "美国 / 英国",
            "\"原子弹之父\"奥本海默的崛起与审判。当他点燃那团火，世界从此不同，而普罗米修斯也终将被缚。",
            "传记/剧情/历史", 8.9, 9655L }
    );
}
