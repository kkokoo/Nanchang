package com.team.user_admin_system.module.repository;

import com.team.user_admin_system.module.entity.Collect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 用户收藏仓库
 */
@Repository
public interface CollectRepository extends JpaRepository<Collect, Integer> {

    /**
     * 查询用户的所有收藏
     */
    List<Collect> findByUserIdOrderByCreateTimeDesc(Integer userId);

    /**
     * 查询用户指定类型的收藏
     */
    List<Collect> findByUserIdAndContentTypeOrderByCreateTimeDesc(Integer userId, Collect.ContentType contentType);

    /**
     * 查询用户指定收藏夹的收藏
     */
    List<Collect> findByUserIdAndFolderNameOrderByCreateTimeDesc(Integer userId, String folderName);

    /**
     * 检查是否已收藏
     */
    Optional<Collect> findByUserIdAndContentTypeAndContentId(Integer userId, Collect.ContentType contentType, Integer contentId);

    /**
     * 删除指定收藏
     */
    void deleteByUserIdAndContentTypeAndContentId(Integer userId, Collect.ContentType contentType, Integer contentId);
}
