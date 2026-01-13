document.addEventListener('DOMContentLoaded', function () {
    //获取轮播图相关元素
    const slides = document.querySelectorAll('.slides li')
    const indicators = document.querySelectorAll('.focus_bd li')
    const prevBtn = document.querySelector('.prev')
    const nextBtn = document.querySelector('.next')
    const slidesContainer = document.querySelector('.slides')

    // 实际图片数量
    const REAL_SLIDE_COUNT = 3
    // 总共图片数量
    const TOTAL_SLIDE_COUNT = slides.length
    //当前显示的图片索引
    let currentIndex = 1
    // 防止画面冲突
    let isAnimating = false
    // 自动轮播定时器
    let autoSlideInterval

    // 初始化轮播图
    function initCarousel() {
        // 设置容器宽度为500%（5张图片）
        slidesContainer.style.width = `${TOTAL_SLIDE_COUNT * 100}%`;

        // 设置每张图片宽度为20%
        slides.forEach((slide, index) => {
            slide.style.width = `${100 / TOTAL_SLIDE_COUNT}%`;
            console.log(`图片${index}宽度: ${slide.style.width}`);
        });

        // 定位到第一个真实图片
        const translateX = currentIndex * (100 / TOTAL_SLIDE_COUNT);
        slidesContainer.style.transform = `translateX(-${translateX}%)`;
        slidesContainer.style.transition = 'none'
        // 设置指示器
        updateIndicators();
    }
    // 根据虚拟索引获取真实索引 - 先定义这个函数！
    function getRealIndex(virtualIndex) {
        if (virtualIndex === 0) return REAL_SLIDE_COUNT - 1; // 复制的最前面是最后一张
        if (virtualIndex === TOTAL_SLIDE_COUNT - 1) return 0; // 复制的最后面是第一张
        return virtualIndex - 1; // 其他情况减1
    }
    //    更新指示器状态
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('bck_red', index === getRealIndex(currentIndex))
        });
    }
    // 切换到制定索引
    function goToSlide(index, animate = true) {
        if (isAnimating) return;
        isAnimating = true
        currentIndex = index
        // 预判边界情况
        let targetIndex = index;
        let skipTransition = false;
        // 预判如果要切换到第4张（最后一张复制图）
        if (index === TOTAL_SLIDE_COUNT - 1) {
            currentIndex = index;
            slidesContainer.style.transition = animate ? 'transform 0.5s ease' : 'none';
            slidesContainer.style.transform = `translateX(-${index * (100 / TOTAL_SLIDE_COUNT)}%)`;

            // 提前更新指示器为第一张（真实索引0）
            indicators.forEach((indicator, i) => {
                if (i === 0) { // 第一张的指示器
                    indicator.classList.add('bck_red');
                } else {
                    indicator.classList.remove('bck_red');
                }
            });

            // 动画结束后无缝跳转
            setTimeout(() => {
                slidesContainer.style.transition = 'none';
                currentIndex = 1; // 跳转到真实的第一张（虚拟索引1）
                slidesContainer.style.transform = `translateX(-${currentIndex * (100 / TOTAL_SLIDE_COUNT)}%)`;
                isAnimating = false;
            }, 500);
            return;
        }

        // 预判如果要切换到第0张（复制的最后一张）
        if (index === 0) {
            currentIndex = index;
            slidesContainer.style.transition = animate ? 'transform 0.5s ease' : 'none';
            slidesContainer.style.transform = `translateX(-${index * (100 / TOTAL_SLIDE_COUNT)}%)`;

            // 提前更新指示器为最后一张（真实索引2）
            indicators.forEach((indicator, i) => {
                if (i === REAL_SLIDE_COUNT - 1) { // 最后一张的指示器
                    indicator.classList.add('bck_red');
                } else {
                    indicator.classList.remove('bck_red');
                }
            });

            // 动画结束后无缝跳转
            setTimeout(() => {
                slidesContainer.style.transition = 'none';
                currentIndex = REAL_SLIDE_COUNT; // 跳转到真实的最后一张（虚拟索引3）
                slidesContainer.style.transform = `translateX(-${currentIndex * (100 / TOTAL_SLIDE_COUNT)}%)`;
                isAnimating = false;
            }, 500);
            return;
        }
        // 应用动画
        slidesContainer.style.transition = animate ? 'transform 0.5s ease' : 'none';
        slidesContainer.style.transform = `translateX(-${index * (100 / TOTAL_SLIDE_COUNT)}%)`;

        // 更新指示器
        updateIndicators();
        // 动画结束后检查边界
        setTimeout(() => {
            isAnimating = false;

            // 检查是否到达边界（复制的图片）
            if (currentIndex === 0) {
                // 跳转到倒数第二张（真实的最后一张）
                currentIndex = REAL_SLIDE_COUNT;
                slidesContainer.style.transition = 'none';
                slidesContainer.style.transform = `translateX(-${currentIndex * (100 / TOTAL_SLIDE_COUNT)}%)`;
            } else if (currentIndex === TOTAL_SLIDE_COUNT - 1) {
                // 跳转到第二张（真实的第一张）
                currentIndex = 1;
                slidesContainer.style.transition = 'none';
                slidesContainer.style.transform = `translateX(-${currentIndex * (100 / TOTAL_SLIDE_COUNT)}%)`;
            }
        }, 100);
    }

    // 切换到下一张
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    // 切换到上一张
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // 开始自动轮播
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 3000);
    }

    // 停止自动轮播
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // 事件监听
    prevBtn.addEventListener('click', function () {
        prevSlide();
        startAutoSlide();
    });

    nextBtn.addEventListener('click', function () {
        nextSlide();
        startAutoSlide();
    });

    // 指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function () {
            // 真实索引转虚拟索引：真实索引+1
            goToSlide(index + 1);
            startAutoSlide();
        });
    });

    // 鼠标悬停暂停
    const focusElement = document.querySelector('.focus');
    focusElement.addEventListener('mouseenter', stopAutoSlide);
    focusElement.addEventListener('mouseleave', startAutoSlide);

    // 触摸滑动支持
    let startX = 0;
    let endX = 0;

    focusElement.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        stopAutoSlide();
    });

    focusElement.addEventListener('touchend', function (e) {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) { // 滑动距离超过50px
            if (diff > 0) {
                nextSlide(); // 向左滑动，下一张
            } else {
                prevSlide(); // 向右滑动，上一张
            }
        }

        startAutoSlide();
    });

    // 初始化
    initCarousel();
    startAutoSlide();
});