"use client";

import { useEffect, useState } from "react";
import { LuX, LuMenu } from "react-icons/lu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
            : "bg-background/50 backdrop-blur-sm border-b border-border/50"
        )}
      >
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group transition-all duration-300"
            >
              <span className="hidden sm:block text-lg md:text-xl font-bold font-mono tracking-tight">
                BOARD
              </span>
            </Link>
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "font-mono uppercase tracking-wider hover:bg-[#8839dd]/10 hover:text-[#8839dd] transition-all duration-300",
                        location.pathname === "/" &&
                          "text-[#8839dd] bg-[#8839dd]/10"
                      )}
                    >
                      <Link to="/">Home</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="font-mono uppercase tracking-wider hover:bg-[#8839dd]/10 hover:text-[#8839dd] transition-all duration-300">
                      Boards
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 w-[400px] lg:w-[500px]">
                        <ListItem
                          title="Create Board"
                          href="/board/create"
                          className="hover:bg-[#8839dd]/10"
                        >
                          Start a new board and organize your tasks efficiently.
                        </ListItem>
                        <ListItem
                          title="My Boards"
                          href="/boards"
                          className="hover:bg-[#8839dd]/10"
                        >
                          View and manage all your existing boards.
                        </ListItem>
                        <ListItem
                          title="Shared Boards"
                          href="/boards/shared"
                          className="hover:bg-[#8839dd]/10"
                        >
                          Access boards shared with you by other users.
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="font-mono uppercase tracking-wider hover:bg-[#8839dd]/10 hover:text-[#8839dd] transition-all duration-300">
                      Resources
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <ListItem
                          title="About"
                          href="#about"
                          className="hover:bg-[#8839dd]/10"
                        >
                          Learn more about the developer and the tech stack.
                        </ListItem>
                        <ListItem
                          title="Projects"
                          href="#projects"
                          className="hover:bg-[#8839dd]/10"
                        >
                          Explore featured projects and case studies.
                        </ListItem>
                        <ListItem
                          title="Contact"
                          href="#contact"
                          className="hover:bg-[#8839dd]/10"
                        >
                          Get in touch for collaborations or inquiries.
                        </ListItem>
                        <ListItem
                          title="Documentation"
                          href="/docs"
                          className="hover:bg-[#8839dd]/10"
                        >
                          Read the complete documentation and guides.
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "font-mono uppercase tracking-wider hover:bg-[#8839dd]/10 hover:text-[#8839dd] transition-all duration-300",
                        location.pathname === "/pricing" &&
                          "text-[#8839dd] bg-[#8839dd]/10"
                      )}
                    >
                      <Link to="/pricing">Pricing</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="font-mono hover:border-[#8839dd]/50 hover:bg-[#8839dd]/10 transition-all duration-300"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="font-mono hover:bg-[#8839dd]/10 hover:text-[#8839dd] transition-all duration-300"
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="font-mono bg-[#8839dd] text-white hover:bg-[#9d4ef5] transition-all duration-300 hover:shadow-lg hover:shadow-[#8839dd]/50 hover:-translate-y-0.5"
                  >
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#8839dd]/10 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <LuX className="w-6 h-6" />
              ) : (
                <LuMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-screen" : "max-h-0"
          )}
        >
          <div className="container mx-auto max-w-7xl px-6 pb-6 space-y-4 bg-background/95 backdrop-blur-lg border-t border-border">
            {/* Mobile Nav Links */}
            <div className="space-y-2 pt-4">
              <Link
                to="/"
                className={cn(
                  "block px-4 py-3 rounded-lg font-mono text-sm uppercase tracking-wider transition-all duration-300",
                  location.pathname === "/"
                    ? "bg-[#8839dd]/20 text-[#8839dd] border border-[#8839dd]/50"
                    : "text-foreground/80 hover:bg-[#8839dd]/10 hover:text-foreground"
                )}
              >
                Home
              </Link>

              {/* Boards Section */}
              <div className="space-y-2">
                <div className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Boards
                </div>
                <Link
                  to="/board/create"
                  className="block px-4 py-3 rounded-lg font-mono text-sm transition-all duration-300 text-foreground/80 hover:bg-[#8839dd]/10 hover:text-foreground ml-2"
                >
                  Create Board
                </Link>
                <Link
                  to="/boards"
                  className="block px-4 py-3 rounded-lg font-mono text-sm transition-all duration-300 text-foreground/80 hover:bg-[#8839dd]/10 hover:text-foreground ml-2"
                >
                  My Boards
                </Link>
                <Link
                  to="/boards/shared"
                  className="block px-4 py-3 rounded-lg font-mono text-sm transition-all duration-300 text-foreground/80 hover:bg-[#8839dd]/10 hover:text-foreground ml-2"
                >
                  Shared Boards
                </Link>
              </div>

              {/* Resources Section */}
              <div className="space-y-2">
                <div className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Resources
                </div>
                <Link
                  to="#about"
                  className="block px-4 py-3 rounded-lg font-mono text-sm transition-all duration-300 text-foreground/80 hover:bg-[#8839dd]/10 hover:text-foreground ml-2"
                >
                  About
                </Link>
                <Link
                  to="#projects"
                  className="block px-4 py-3 rounded-lg font-mono text-sm transition-all duration-300 text-foreground/80 hover:bg-[#8839dd]/10 hover:text-foreground ml-2"
                >
                  Projects
                </Link>
                <Link
                  to="#contact"
                  className="block px-4 py-3 rounded-lg font-mono text-sm transition-all duration-300 text-foreground/80 hover:bg-[#8839dd]/10 hover:text-foreground ml-2"
                >
                  Contact
                </Link>
              </div>

              <Link
                to="/pricing"
                className={cn(
                  "block px-4 py-3 rounded-lg font-mono text-sm uppercase tracking-wider transition-all duration-300",
                  location.pathname === "/pricing"
                    ? "bg-[#8839dd]/20 text-[#8839dd] border border-[#8839dd]/50"
                    : "text-foreground/80 hover:bg-[#8839dd]/10 hover:text-foreground"
                )}
              >
                Pricing
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-border space-y-2">
              {user ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full font-mono hover:border-[#8839dd]/50 hover:bg-[#8839dd]/10"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full font-mono hover:border-[#8839dd]/50 hover:bg-[#8839dd]/10"
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full font-mono bg-[#8839dd] text-white hover:bg-[#9d4ef5]"
                  >
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
}

function ListItem({ title, children, href, className, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
        >
          <div className="text-sm font-medium leading-none font-mono uppercase tracking-wider">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
