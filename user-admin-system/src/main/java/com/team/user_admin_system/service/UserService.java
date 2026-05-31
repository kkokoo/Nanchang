package com.team.user_admin_system.service;

import com.team.user_admin_system.entity.SysUser;
import com.team.user_admin_system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 用户业务逻辑层
 * 作用：处理用户相关的业务（登录、注册、查询等）
 * 介于 Controller 和 Repository 中间
 */
@Service // 标记这是业务类，让Spring管理
public class UserService {

    // 注入仓库类（操作数据库）
    private final UserRepository userRepository;

    // 构造方法注入（Spring自动传参）
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 登录业务：根据用户名查用户
     */
    public SysUser login(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * 注册业务：保存用户到数据库
     * 密码已经在Controller加密过了
     */
    public SysUser register(SysUser user) {
        return userRepository.save(user);
    }

    /**
     * 查询所有用户
     */
    public List<SysUser> getAll() {
        return userRepository.findAll();
    }

    /**
     * 根据用户ID查询单个用户
     */
    public SysUser getById(Integer id) {
        return userRepository.findById(id).orElse(null);
    }
}