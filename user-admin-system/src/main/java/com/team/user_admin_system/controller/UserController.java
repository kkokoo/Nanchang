package com.team.user_admin_system.controller;

// 导入用户实体类（对应数据库user表）
import com.team.user_admin_system.entity.SysUser;
// 导入用户业务逻辑类
import com.team.user_admin_system.service.UserService;
// 导入统一返回结果工具类
import com.team.user_admin_system.util.Result;
// 导入密码加密工具
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// SpringBoot 接口注解
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户控制器
 * 功能：处理用户登录、注册、查询等接口
 * 对外提供前端访问地址
 */
@RestController // 标记这是一个接口控制器（返回JSON数据）
@RequestMapping("/user") // 统一前缀：所有接口地址以 /user 开头
public class UserController {

    // 业务对象：处理用户逻辑
    private final UserService userService;
    // 加密工具：BCrypt密码加密
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * 构造方法注入（Spring自动把对象传进来）
     */
    public UserController(UserService userService, BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 用户登录接口
     * 地址：POST /user/login
     * 参数：用户名、密码
     * 返回：成功返回用户信息，失败返回提示
     */
    @PostMapping("/login")
    public Result<SysUser> login(@RequestBody SysUser user) {
        // 根据用户名查用户是否存在
        SysUser loginUser = userService.login(user.getUsername());

        // 用户不存在
        if (loginUser == null) {
            return Result.fail("用户不存在");
        }
        // 密码比对（前端输入的密码 VS 数据库加密密码）
        if (!passwordEncoder.matches(user.getPassword(), loginUser.getPassword())) {
            return Result.fail("密码错误");
        }

        // 登录成功
        return Result.success(loginUser);
    }

    /**
     * 用户注册接口
     * 地址：POST /user/register
     * 功能：检查用户名是否重复 + 密码加密 + 保存到数据库
     */
    @PostMapping("/register")
    public Result<?> register(@RequestBody SysUser user) {
        // 检查用户名是否已存在
        SysUser exist = userService.login(user.getUsername());
        if (exist != null) {
            return Result.fail("用户名已存在");
        }

        // 密码加密（核心安全功能）
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // 保存用户
        userService.register(user);
        return Result.success();
    }

    /**
     * 查询所有用户
     * 地址：GET /user/list
     */
    @GetMapping("/list")
    public Result<List<SysUser>> list() {
        List<SysUser> list = userService.getAll();
        return Result.success(list);
    }

    /**
     * 根据ID查询单个用户
     * 地址：GET /user/get/1
     */
    @GetMapping("/get/{id}")
    public Result<SysUser> get(@PathVariable Integer id) {
        SysUser user = userService.getById(id);
        return Result.success(user);
    }
}