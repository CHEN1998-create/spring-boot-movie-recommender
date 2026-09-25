package cn.filmisle.movie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/** 标签仓库 */
public interface MovieTagRepository extends JpaRepository<MovieTag, Long> {

    /** 全站去重标签列表（按标签名去重） */
    @Query("select distinct t.tag from MovieTag t order by t.tag")
    List<String> findDistinctTags();
}
