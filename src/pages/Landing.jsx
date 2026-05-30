import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, LogIn, Sparkles, Scan, MessageSquare, TrendingUp, Shield, Zap, Users, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../assets/image/Logo.png";
import heroVisual from "../assets/image/Mackbook 14-front.png";
import centang from "../assets/image/Centang.png";
import { InstagramButton, LinkedInButton } from "../components/ui/SocialIcons";

gsap.registerPlugin(ScrollTrigger);

// ─── SVG Abstract Contour Lines Component ───
function ContourLines({ className = "", opacity = 0.08, color = "#6FCF97", variant = 1 }) {
  if (variant === 1) {
    return (
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        <path d="M0 450 C 200 350, 400 550, 700 450 S 1100 350, 1440 450" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M0 500 C 250 400, 500 600, 800 500 S 1200 400, 1440 500" fill="none" stroke={color} strokeWidth="1.2" />
        <path d="M0 550 C 300 450, 600 650, 900 550 S 1300 450, 1440 550" fill="none" stroke={color} strokeWidth="0.8" />
        <path d="M0 400 C 180 300, 380 500, 650 400 S 1050 300, 1440 400" fill="none" stroke={color} strokeWidth="1" />
        <path d="M0 600 C 220 520, 480 700, 750 600 S 1150 520, 1440 600" fill="none" stroke={color} strokeWidth="0.6" />
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        <path d="M0 300 Q 200 100, 400 300 T 800 300 T 1200 300 T 1440 300" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M0 400 Q 250 200, 500 400 T 900 400 T 1300 400 T 1440 400" fill="none" stroke={color} strokeWidth="1" />
        <path d="M0 500 Q 300 300, 600 500 T 1000 500 T 1440 500" fill="none" stroke={color} strokeWidth="0.8" />
        <path d="M0 600 Q 180 450, 360 600 T 720 600 T 1080 600 T 1440 600" fill="none" stroke={color} strokeWidth="0.5" />
        <path d="M0 700 Q 220 550, 440 700 T 880 700 T 1440 700" fill="none" stroke={color} strokeWidth="0.4" />
      </svg>
    );
  }
  if (variant === 3) {
    return (
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        <path d="M-100 200 C 200 50, 400 350, 700 200 C 1000 50, 1200 350, 1540 200" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M-100 350 C 250 200, 450 500, 750 350 C 1050 200, 1250 500, 1540 350" fill="none" stroke={color} strokeWidth="1" />
        <path d="M-100 500 C 300 350, 500 650, 800 500 C 1100 350, 1300 650, 1540 500" fill="none" stroke={color} strokeWidth="0.7" />
        <path d="M-100 650 C 200 520, 400 780, 700 650 C 1000 520, 1200 780, 1540 650" fill="none" stroke={color} strokeWidth="0.5" />
      </svg>
    );
  }
  // Variant 4 — Cloud Abstract Contours (billowy, soft cloud-like shapes)
  if (variant === 4) {
    return (
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        {/* Cloud layer 1 — top */}
        <path d="M-50 200 Q 80 140, 180 200 Q 300 120, 450 180 Q 600 100, 750 190 Q 900 130, 1050 180 Q 1200 110, 1350 200 Q 1450 150, 1540 200" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Cloud layer 2 */}
        <path d="M-50 280 Q 100 210, 250 270 Q 400 200, 550 260 Q 700 190, 850 270 Q 1000 210, 1150 260 Q 1300 200, 1490 280" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        {/* Cloud layer 3 */}
        <path d="M-50 360 Q 150 290, 320 350 Q 480 280, 640 340 Q 800 270, 960 350 Q 1100 300, 1260 340 Q 1400 290, 1540 360" fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
        {/* Cloud layer 4 — middle */}
        <path d="M-50 450 Q 120 380, 280 440 Q 420 370, 580 430 Q 740 360, 900 440 Q 1060 380, 1220 430 Q 1380 370, 1540 450" fill="none" stroke={color} strokeWidth="0.7" strokeLinecap="round" />
        {/* Cloud layer 5 */}
        <path d="M-50 540 Q 180 480, 350 530 Q 520 460, 680 520 Q 850 460, 1020 530 Q 1180 480, 1350 520 Q 1480 470, 1540 540" fill="none" stroke={color} strokeWidth="0.5" strokeLinecap="round" />
        {/* Cloud layer 6 — bottom */}
        <path d="M-50 630 Q 130 580, 300 620 Q 460 560, 620 630 Q 780 570, 940 620 Q 1100 560, 1280 630 Q 1420 580, 1540 630" fill="none" stroke={color} strokeWidth="0.4" strokeLinecap="round" />
        {/* Cloud puffs — scattered circles */}
        <ellipse cx="200" cy="150" rx="60" ry="30" fill="none" stroke={color} strokeWidth="0.6" strokeLinecap="round" />
        <ellipse cx="550" cy="130" rx="50" ry="25" fill="none" stroke={color} strokeWidth="0.5" strokeLinecap="round" />
        <ellipse cx="900" cy="160" rx="70" ry="28" fill="none" stroke={color} strokeWidth="0.6" strokeLinecap="round" />
        <ellipse cx="1250" cy="140" rx="55" ry="26" fill="none" stroke={color} strokeWidth="0.5" strokeLinecap="round" />
        <ellipse cx="350" cy="400" rx="65" ry="30" fill="none" stroke={color} strokeWidth="0.5" strokeLinecap="round" />
        <ellipse cx="750" cy="380" rx="80" ry="32" fill="none" stroke={color} strokeWidth="0.6" strokeLinecap="round" />
        <ellipse cx="1150" cy="410" rx="60" ry="28" fill="none" stroke={color} strokeWidth="0.5" strokeLinecap="round" />
      </svg>
    );
  }
  return null;
}

function CountUp({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutQuad = 1 - (1 - progress) * (1 - progress);
            const currentCount = Math.floor(easeOutQuad * target);
            // Display gradual number then format to "1K" only when complete
            setCount(currentCount);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [target, duration]);

  // Smooth formatting: show raw number while animating, "1K+" when fully done
  const displayCount = target >= 1000 && count >= 1000 ? "1K+" : `+${count}`;

  return (
    <span ref={elementRef}>
      {displayCount}
    </span>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const handleImgError = (key) => setImgErrors(prev => ({ ...prev, [key]: true }));

  // GSAP Refs
  const heroHeadlineRef = useRef(null);
  const heroImageRef = useRef(null);
  const featureCardsRef = useRef([]);
  const stepCardsRef = useRef([]);
  const aboutCardsRef = useRef([]);
  const scrollTextRef = useRef(null);
  const navLinkRefs = useRef([]);
  const orbRefs = useRef([]);
  
  // Store attached event handlers for proper cleanup
  const cardHoverHandlers = useRef([]);
  const aboutHoverHandlers = useRef([]);

  // AI Slider State for Panel 2
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const slides = [
    {
      icon: Scan,
      title: "Scan nota grosir, AI otomatis",
      desc: "input stok tanpa ketik manual",
      color: "text-[#6FCF97]"
    },
    {
      icon: MessageSquare,
      title: "AI Business Advisor",
      desc: "konsultasi strategi toko & analisis riil",
      color: "text-[#B5E85A]"
    },
    {
      icon: TrendingUp,
      title: "Dasbor & Analitik Pintar",
      desc: "pantau laba rugi, omzet, & stok terjual",
      color: "text-[#6FCF97]"
    }
  ];

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStartX(0);
    setTouchEndX(0);
  };

  const handleMouseDown = (e) => {
    setTouchStartX(e.clientX);
  };

  const handleMouseUp = (e) => {
    if (!touchStartX) return;
    const diff = touchStartX - e.clientX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStartX(0);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ═══ GSAP ANIMATIONS ═══
  useEffect(() => {
    // Hero Headline Staggered Text Reveal
    if (heroHeadlineRef.current) {
      gsap.fromTo(
        heroHeadlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }

    // Hero Image Floating Animation
    if (heroImageRef.current) {
      gsap.fromTo(
        heroImageRef.current,
        { opacity: 0, x: 50, y: 30 },
        { opacity: 1, x: 0, y: 0, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );

      // Floating loop after load
      gsap.to(heroImageRef.current, {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });
    }

    // Feature Cards Staggered Scroll Reveal
    featureCardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: i * 0.15,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 50%",
              scrub: false,
              once: true,
            },
          }
        );

        // Hover effect with cleanable handlers
        const handleEnter = () => {
          gsap.to(card, {
            y: -10,
            boxShadow: "0 20px 50px rgba(111, 207, 151, 0.3)",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const handleLeave = () => {
          gsap.to(card, {
            y: 0,
            boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", handleEnter);
        card.addEventListener("mouseleave", handleLeave);
        cardHoverHandlers.current.push({ el: card, enter: handleEnter, leave: handleLeave });
      }
    });

    // Step Cards Scroll Reveal
    stepCardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 55%",
              scrub: false,
              once: true,
            },
          }
        );
      }
    });

    // About Cards Hover Effects
    aboutCardsRef.current.forEach((card) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              once: true,
            },
          }
        );

        const handleEnter = () => {
          gsap.to(card, {
            y: -5,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderColor: "#6FCF97",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const handleLeave = () => {
          gsap.to(card, {
            y: 0,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "rgba(255, 255, 255, 0.1)",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", handleEnter);
        card.addEventListener("mouseleave", handleLeave);
        aboutHoverHandlers.current.push({ el: card, enter: handleEnter, leave: handleLeave });
      }
    });

    // Floating Gradient Orbs Animation
    orbRefs.current.forEach((orb, i) => {
      if (orb) {
        gsap.to(orb, {
          y: `+=${30 + i * 10}`,
          x: `+=${15 - i * 8}`,
          duration: 4 + i * 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.7,
        });
        gsap.to(orb, {
          rotate: 360,
          duration: 20 + i * 5,
          repeat: -1,
          ease: "none",
        });
        gsap.to(orb, {
          scale: 1.15,
          duration: 3 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.4,
        });
      }
    });

    // Horizontal Scroll Text Animation - Dynamic Width
    if (scrollTextRef.current) {
      const parentSection = scrollTextRef.current.closest('section');
      if (parentSection) {
        const contentWidth = scrollTextRef.current.scrollWidth;
        // Scroll by half the content width since the text is duplicated once
        const xTarget = -(contentWidth / 2);
        gsap.to(scrollTextRef.current, {
          x: xTarget,
          scrollTrigger: {
            trigger: parentSection,
            start: "top top",
            end: "+=1200",
            scrub: 4,
            pin: true,
            markers: false,
            pinSpacing: true,
          },
        });
      }
    }

    return () => {
      // Clean up card hover handlers
      cardHoverHandlers.current.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      cardHoverHandlers.current = [];

      // Clean up about hover handlers
      aboutHoverHandlers.current.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      aboutHoverHandlers.current = [];

      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-[#6FCF97] selection:text-[#0A2010]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <div 
        onMouseMove={handleMouseMove}
        className="relative w-full overflow-hidden group/hero-bg" 
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0D2010 0%, #1A4020 22%, #2D6B35 52%, #5BAA4A 76%, #8FCC5A 100%)",
        }}
      >
        {/* White Radial Spotlight Glow following mouse cursor */}
        <div 
          className="absolute inset-0 opacity-0 group-hover/hero-bg:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle 500px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.15), transparent 80%)",
          }}
        />

        {/* Abstract Contour Lines */}
        <ContourLines variant={1} color="#FFFFFF" opacity={0.06} className="z-[1]" />

        {/* Noise / grain texture */}
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "150px",
          }} />

        {/* Glow blobs */}
        <div className="absolute top-[-10%] right-[10%] w-[700px] h-[700px] rounded-full opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, #B5E85A 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-[5%] w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6FCF97 0%, transparent 70%)" }} />

        {/* ─── NAVBAR ─── */}
        <nav className={`relative z-30 flex items-center justify-between px-8 lg:px-14 pt-8 transition-all duration-300 animate-fade-in-down`}>
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3" aria-label="ModaPos Home">
            {imgErrors.logo ? (
              <div className="h-9 w-9 rounded-full bg-[#6FCF97] flex items-center justify-center text-xs font-bold text-[#0D2010]">M</div>
            ) : (
              <img src={logo} alt="ModaPos" className="h-9 w-9 object-contain" onError={() => handleImgError('logo')} />
            )}
            <span className="text-white text-xl font-bold tracking-tight" style={{ fontFamily: "'Wasted Vindey', serif" }}>
              ModaPos
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-white/75">
            <a href="#fitur" className="hover:text-white transition-colors" ref={el => navLinkRefs.current[0] = el} onMouseEnter={() => { const el = navLinkRefs.current[0]; if (el) gsap.to(el, { rotationX: 360, duration: 0.6, ease: "power2.inOut" }); }} onMouseLeave={() => { const el = navLinkRefs.current[0]; if (el) gsap.to(el, { rotationX: 0, duration: 0.6, ease: "power2.inOut" }); }}>Fitur AI</a>
            <a href="#cara-kerja" className="hover:text-white transition-colors" ref={el => navLinkRefs.current[1] = el} onMouseEnter={() => { const el = navLinkRefs.current[1]; if (el) gsap.to(el, { rotationX: 360, duration: 0.6, ease: "power2.inOut" }); }} onMouseLeave={() => { const el = navLinkRefs.current[1]; if (el) gsap.to(el, { rotationX: 0, duration: 0.6, ease: "power2.inOut" }); }}>Cara Kerja</a>
            <a href="#tentang" className="hover:text-white transition-colors" ref={el => navLinkRefs.current[2] = el} onMouseEnter={() => { const el = navLinkRefs.current[2]; if (el) gsap.to(el, { rotationX: 360, duration: 0.6, ease: "power2.inOut" }); }} onMouseLeave={() => { const el = navLinkRefs.current[2]; if (el) gsap.to(el, { rotationX: 0, duration: 0.6, ease: "power2.inOut" }); }}>Tentang</a>
            <a href="#kontak" className="hover:text-white transition-colors" ref={el => navLinkRefs.current[3] = el} onMouseEnter={() => { const el = navLinkRefs.current[3]; if (el) gsap.to(el, { rotationX: 360, duration: 0.6, ease: "power2.inOut" }); }} onMouseLeave={() => { const el = navLinkRefs.current[3]; if (el) gsap.to(el, { rotationX: 0, duration: 0.6, ease: "power2.inOut" }); }}>Kontak</a>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="hidden md:flex h-9 w-9 rounded-full bg-white/10 border border-white/20 items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Login"
            >
              <LogIn className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#0D2010] text-xs font-extrabold hover:bg-[#C8F07A] transition-colors shadow-md"
            >
              Mulai Gratis
            </button>
            {/* Mobile Hamburger */}
            <button
              className="md:hidden h-9 w-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-24 left-4 right-4 z-40 rounded-3xl bg-[#0D2010]/95 border border-white/10 backdrop-blur-lg p-6 flex flex-col gap-5 text-white font-semibold shadow-2xl">
            <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#6FCF97]">Fitur AI</a>
            <a href="#cara-kerja" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#6FCF97]">Cara Kerja</a>
            <a href="#tentang" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#6FCF97]">Tentang</a>
            <a href="#kontak" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#6FCF97]">Kontak</a>
            <div className="flex gap-3 pt-2 border-t border-white/10">
              <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="flex-1 py-3 rounded-2xl border border-white/30 text-sm font-bold hover:bg-white/10 transition-colors">
                Masuk
              </button>
              <button onClick={() => { setMobileMenuOpen(false); navigate('/register'); }} className="flex-1 py-3 rounded-2xl bg-white text-[#0D2010] text-sm font-extrabold hover:bg-[#C8F07A] transition-colors">
                Mulai Gratis
              </button>
            </div>
          </div>
        )}

        {/* ─── HERO CONTENT ─── */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center justify-between px-8 lg:px-14 pt-16 lg:pt-20 pb-12 lg:pb-20 min-h-[calc(100vh-180px)] gap-8">

          {/* Left: Headline + CTA */}
          <div className="flex-1 max-w-2xl">
            {/* Mega Headline */}
            <h1 
              ref={heroHeadlineRef}
              className="font-kugile font-normal leading-[0.9] tracking-tight text-white"
              style={{ fontFamily: "'Kugile', sans-serif", fontSize: "clamp(3rem, 8vw, 6rem)" }}>
              Revolusi
              <br />
              <span className="text-white/35">Kasir</span>{" "}
              <span className="text-white">Pintar</span>
              <br />
              <span className="text-white">
                Berbasis{" "}
                <span className="relative inline-flex items-center gap-3">
                  AI
                  {/* Centang Badge from Assets */}
                  {imgErrors.centang ? null : (
                    <img src={centang} alt="Verified" className="h-12 w-12 sm:h-16 sm:w-16 object-contain" onError={() => handleImgError('centang')} />
                  )}
                </span>
              </span>
            </h1>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-10 animate-fade-in-up delay-400">
              <button
                onClick={() => navigate('/register')}
                className="group flex items-center gap-3 bg-black text-white font-bold px-8 py-4 hover:bg-[#111] transition-all hover:scale-[1.02] shadow-2xl text-base cursor-pointer"
              >
                Mulai Sekarang
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <p className="text-white/55 text-sm max-w-[230px] leading-relaxed font-medium">
                Kelola stok, kasir digital, dan analisis bisnis dalam satu platform AI.
              </p>
            </div>
          </div>

          {/* Right: MacBook Hero Visual */}
          <div ref={heroImageRef} className="flex-1 flex justify-center lg:justify-end items-center lg:self-center relative">
            {imgErrors.heroVisual ? (
              <div className="w-full max-w-[540px] lg:max-w-[700px] aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-sm">
                ModaPos Preview
              </div>
            ) : (
              <img
                src={heroVisual}
                alt="ModaPos App on MacBook"
                className="w-full max-w-[540px] lg:max-w-[700px] object-contain"
                style={{ filter: "drop-shadow(0 60px 120px rgba(0,0,0,0.7)) brightness(1.05)" }}
                onError={() => handleImgError('heroVisual')}
              />
            )}
          </div>
        </div>

        {/* ─── BOTTOM 3-PANEL INFO BAR ─── */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 w-full">
          {/* Panel 1 — White */}
          <div className="bg-white px-10 py-8 flex flex-col justify-between gap-4 animate-fade-in-up delay-600">
            <h3 className="text-xl font-extrabold text-[#0D2010] leading-snug max-w-[200px]">
              Mulai perjalanan bisnis digital Anda
            </h3>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-bold text-[#0D2010] underline underline-offset-4 hover:opacity-50 transition-opacity cursor-pointer text-left"
            >
              Daftar Sekarang →
            </button>
          </div>

          {/* Panel 2 — Light Gray Slider */}
          <div 
            className="bg-[#EEEEEE] px-10 pt-8 pb-10 overflow-hidden relative select-none cursor-grab active:cursor-grabbing group/slider flex flex-col justify-between min-h-[144px] animate-fade-in-up delay-700"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            role="region"
            aria-roledescription="carousel"
            aria-label="Fitur AI ModaPos"
          >
            {/* Left Chevron Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-[#0D2010] opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-white hover:scale-105 active:scale-95"
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Slider Viewport Wrapper */}
            <div className="w-full overflow-hidden" aria-live="polite">
              {/* Slide Container */}
              <div 
                className="flex transition-transform duration-500 ease-out w-full"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {slides.map((slide, index) => {
                  const SlideIcon = slide.icon;
                  return (
                    <div
                      key={index}
                      className="w-full flex-shrink-0 flex items-center gap-5"
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`Slide ${index + 1}: ${slide.title}`}
                    >
                      <div className="h-12 w-12 rounded-2xl bg-[#0D2010] flex items-center justify-center shrink-0 shadow-md">
                        <SlideIcon className={`h-6 w-6 ${slide.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A3020] leading-snug break-words">
                          {slide.title}<br />{slide.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Chevron Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-[#0D2010] opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-white hover:scale-105 active:scale-95"
              aria-label="Slide berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Pagination dots & swipe helper */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-1.5 z-20" role="tablist" aria-label="Pilih slide">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide(index);
                    }}
                    role="tab"
                    aria-selected={activeSlide === index}
                    aria-label={`Slide ${index + 1}`}
                    className={`h-1 transition-all duration-300 rounded-full ${
                      activeSlide === index ? "w-8 bg-[#0D2010]" : "w-3 bg-[#0D2010]/25 hover:bg-[#0D2010]/55"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-[#0D2010]/40 uppercase tracking-wider animate-pulse hidden group-hover/slider:block pointer-events-none">
                Geser kanan →
              </span>
            </div>
          </div>

          {/* Panel 3 — Dark */}
          <div className="bg-[#0D2010] px-10 py-8 flex items-center gap-5 animate-fade-in-up delay-800">
            <div className="flex -space-x-3 shrink-0">
              {[["A", "bg-[#6FCF97]"], ["B", "bg-[#B5E85A]"], ["C", "bg-[#4A9E6A]"]].map(([l, c], i) => (
                <div key={i} className={`h-10 w-10 rounded-full border-2 border-[#0D2010] ${c} flex items-center justify-center text-[10px] font-extrabold text-[#0D2010]`}>{l}</div>
              ))}
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">
                <CountUp target={1000} />
              </p>
              <p className="text-xs text-white/45 font-medium mt-0.5">UMKM telah mengoptimalkan bisnis mereka</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ SCROLL TEXT ANIMATION ═══════════════════════ */}
      <section className="relative w-full min-h-screen bg-white flex items-center justify-center overflow-hidden">
        {/* Abstract Cloud Contour Lines */}
        <ContourLines variant={4} color="#6FCF97" opacity={0.07} className="z-0" />

        {/* Floating Gradient Orbs */}
        <div 
          ref={(el) => orbRefs.current[0] = el}
          className="absolute top-[10%] left-[5%] w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(111,207,151,0.25) 0%, transparent 70%)" }}
        />
        <div 
          ref={(el) => orbRefs.current[1] = el}
          className="absolute top-[5%] right-[8%] w-[220px] h-[220px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(181,232,90,0.2) 0%, transparent 70%)" }}
        />
        <div 
          ref={(el) => orbRefs.current[2] = el}
          className="absolute bottom-[15%] left-[12%] w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(111,207,151,0.2) 0%, transparent 70%)" }}
        />
        <div 
          ref={(el) => orbRefs.current[3] = el}
          className="absolute bottom-[8%] right-[5%] w-[250px] h-[250px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(181,232,90,0.15) 0%, transparent 70%)" }}
        />

        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, #6FCF97 0%, transparent 70%)" }} />
          <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full blur-3xl opacity-15"
            style={{ background: "radial-gradient(circle, #B5E85A 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 w-full px-8 lg:px-14">
          <div className="overflow-hidden py-16 md:py-0">
               <div 
                 ref={scrollTextRef}
                 className="whitespace-nowrap flex items-center gap-12 text-3xl md:text-6xl font-extrabold leading-tight text-[#0D2010]"
                 style={{ fontFamily: "'Kugile', sans-serif" }}
            >
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Kasir AI terpercaya #1 di Indonesia</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Hemat hingga 70% waktu operasional</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Kelola 10 toko dalam 1 dashboard</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Raih analisis bisnis real-time</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Skalabilitas tanpa batas untuk pertumbuhan</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Integrasi mudah dengan sistem yang ada</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Support 24/7 untuk kemudahan Anda</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Keamanan data tingkat enterprise</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Kasir AI terpercaya #1 di Indonesia</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Hemat hingga 70% waktu operasional</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Kelola 10 toko dalam 1 dashboard</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Raih analisis bisnis real-time</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Skalabilitas tanpa batas untuk pertumbuhan</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Integrasi mudah dengan sistem yang ada</span>
              <span className="text-[#6FCF97] min-w-max text-3xl md:text-6xl">•</span>
              <span className="text-[#0D2010] min-w-max drop-shadow-lg">Support 24/7 untuk kemudahan Anda</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION: FITUR ═══════════════════════ */}
      <section id="fitur" className="relative bg-[#F7F7F5] py-28 px-8 lg:px-14">
        <ContourLines variant={3} color="#6FCF97" opacity={0.05} className="z-0" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6FCF97] mb-4">Fitur Unggulan</p>
              <h2 className="text-4xl lg:text-6xl font-extrabold text-[#0D2010] leading-tight max-w-2xl" style={{ fontFamily: "'Kugile', sans-serif" }}>
                Kekuatan Gemini AI<br />
                <span className="text-[#2D6B35]">di Setiap Fitur</span>
              </h2>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="group flex items-center gap-3 bg-[#0D2010] text-white font-bold px-7 py-4 hover:bg-[#1A4020] transition-all shrink-0"
            >
              Coba Gratis <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Scan, color: "bg-[#0D2010]", iconColor: "text-[#6FCF97]", label: "AI Receipt Scanner", desc: "Foto nota grosir → AI ekstrak nama barang, stok, harga jual otomatis dengan markup cerdas." },
              { icon: MessageSquare, color: "bg-[#6FCF97]", iconColor: "text-[#0D2010]", label: "AI Business Advisor", desc: "Konsultan AI berbasis data transaksi nyata toko Anda. Tanya apa saja, jawab akurat." },
              { icon: TrendingUp, color: "bg-[#0D2010]", iconColor: "text-[#B5E85A]", label: "POS Digital Instan", desc: "Kasir digital yang cepat dan intuitif. Proses transaksi, cetak struk, kelola keranjang." },
              { icon: Sparkles, color: "bg-[#1A4020]", iconColor: "text-[#6FCF97]", label: "Dasbor Analitik", desc: "Pantau omzet, produk terlaris, dan tren penjualan harian dalam satu tampilan." },
            ].map((f, i) => (
              <div 
                key={i} 
                ref={(el) => {
                  if (el) featureCardsRef.current[i] = el;
                }}
                className={`${f.color} rounded-3xl p-8 flex flex-col gap-6 transition-all duration-300`}
              >
                <div className={`h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center ${f.iconColor}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.label}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{f.desc}</p>
                </div>
                <div className={`mt-auto flex items-center gap-1 text-xs font-bold ${f.iconColor} opacity-70`}>
                  Pelajari <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION: CARA KERJA ═══════════════════════ */}
      <section id="cara-kerja" className="relative bg-white py-28 px-8 lg:px-14 border-t border-gray-100">
        <ContourLines variant={2} color="#6FCF97" opacity={0.04} className="z-0" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6FCF97] mb-4">Alur Penggunaan</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0D2010]" style={{ fontFamily: "'Kugile', sans-serif" }}>4 Langkah Mudah</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Daftar Akun", desc: "Buat akun dalam 30 detik dengan email atau Google." },
              { num: "02", title: "Setup Toko", desc: "Isi nama toko dan detail Anda. Langsung bisa pakai." },
              { num: "03", title: "Scan Nota", desc: "Upload foto nota grosir, AI langsung input semua stok." },
              { num: "04", title: "Analisis & Jual", desc: "Kasir, cek dasbor, tanya AI Advisor untuk saran bisnis." },
            ].map((s, i) => (
              <div 
                key={i} 
                ref={(el) => {
                  if (el) stepCardsRef.current[i] = el;
                }}
                className="bg-[#F7F7F5] rounded-3xl p-8 hover:bg-[#EDFAF2] transition-all duration-300 border border-gray-100"
              >
                <span className="text-5xl font-extrabold text-[#0D2010]/10">{s.num}</span>
                <h3 className="text-lg font-bold text-[#0D2010] mt-4 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION: TENTANG ═══════════════════════ */}
      <section id="tentang" className="relative bg-[#0D2010] py-28 px-8 lg:px-14">
        <ContourLines variant={3} color="#6FCF97" opacity={0.05} className="z-0" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6FCF97] mb-4">Mengapa ModaPos?</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight" style={{ fontFamily: "'Kugile', sans-serif" }}>
              Dibangun dengan Ekosistem <br />
              <span className="text-[#6FCF97]">Google Terbaik</span>
            </h2>
            <p className="text-white/50 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              ModaPos adalah proyek #JuaraVibeCoding yang menggabungkan Google Gemini AI, Firebase, dan Vite React untuk solusi kasir UMKM masa depan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, badge: "AI Core", title: "Google Gemini 2.5 Flash", desc: "Model AI multimodal terbaru dari Google — memproses teks, gambar nota, dan data transaksi untuk memberikan jawaban bisnis akurat." },
              { icon: Shield, badge: "Google Cloud", title: "Firebase Auth & Firestore", desc: "Autentikasi aman dengan Google Account dan database realtime yang sinkron otomatis. Data Anda aman di Google Cloud." },
              { icon: Users, badge: "Universal", title: "Untuk Semua Jenis UMKM", desc: "Dari warung kelontong, toko fashion, hingga kafe — ModaPos bekerja untuk semua industri ritel tanpa konfigurasi rumit." },
            ].map((item, i) => (
              <div 
                key={i} 
                ref={(el) => {
                  if (el) aboutCardsRef.current[i] = el;
                }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 transition-all duration-300 group cursor-pointer"
              >
                <div className={`h-12 w-12 rounded-2xl bg-[#6FCF97]/10 flex items-center justify-center text-[#6FCF97] mb-6 group-hover:bg-[#6FCF97] group-hover:text-[#0D2010] transition-colors`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6FCF97]/60 mb-3 block">{item.badge}</span>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION: KONTAK ═══════════════════════ */}
      <section id="kontak" className="bg-[#F7F7F5] py-20 px-8 lg:px-14 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6FCF97] mb-2">Hubungi Kami</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0D2010]" style={{ fontFamily: "'Kugile', sans-serif" }}>Ada pertanyaan?</h2>
            <p className="text-gray-500 text-sm mt-2">Kami siap membantu Anda mulai menggunakan ModaPos.</p>
          </div>
          <div className="flex gap-6">
            <a href="https://www.linkedin.com/in/zaky-van-gobel-ba844b316/?locale=id-ID" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInButton />
            </a>
            <a href="https://www.instagram.com/zaky.vg/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramButton />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA BANNER ═══════════════════════ */}
      <section className="py-28 px-8 lg:px-14 text-white text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D2010 0%, #1A4020 45%, #2D6B35 100%)" }}>
        <ContourLines variant={1} color="#B5E85A" opacity={0.06} className="z-0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #B5E85A 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6FCF97] mb-4">#JuaraVibeCoding Google</p>
          <h2 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6" style={{ fontFamily: "'Kugile', sans-serif" }}>
            Siap Digitalkan<br />Bisnis Anda Sekarang?
          </h2>
          <p className="text-white/55 text-base mb-10 max-w-xl mx-auto leading-relaxed">
            Bergabunglah dengan ribuan pelaku UMKM yang telah merasakan efisiensi kasir berbasis AI dari ModaPos.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="group inline-flex items-center gap-3 bg-white text-[#0D2010] font-extrabold px-10 py-5 hover:bg-[#C8F07A] transition-all hover:scale-[1.02] shadow-2xl text-lg"
          >
            Mulai Percobaan Gratis
            <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="bg-[#050D07] py-10 px-8 lg:px-14 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30 font-medium">
          <div className="flex items-center gap-3">
            {imgErrors.logoFooter ? (
              <div className="h-6 w-6 rounded-full bg-[#6FCF97]/50 flex items-center justify-center text-[8px] font-bold text-[#0D2010]">M</div>
            ) : (
              <img src={logo} alt="ModaPos" className="h-6 w-6 object-contain opacity-50" onError={() => handleImgError('logoFooter')} />
            )}
            <span className="font-bold text-white/50" style={{ fontFamily: "'Wasted Vindey', serif" }}>ModaPos.</span>
          </div>
          <span>&copy; {new Date().getFullYear()} ModaPos. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}