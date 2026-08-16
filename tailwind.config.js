/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#060A12",
        surface: "#0B1320",
        raised: "#111827",
        line: "#1C2536",
        ink: { DEFAULT: "#E8EDF5", mute: "#8494AC", faint: "#4B5A73" },
        // SEMANTIC ONLY - see CLAUDE.md section 3. Never use for mood.
        verified: "#22D3EE",
        unverified: "#FF4D6D",
        // nova = structure (borders, fills, bars, panel edges).
        // nova-ink = the same signal at a weight small text can carry.
        // See CLAUDE.md section 3, "The one exception to the colour law".
        nova: { DEFAULT: "#7C3AED", ink: "#A78BFA" },
        pending: "#E8B339",
        deep: "#1E3A8A",
      },
      fontFamily: {
        // The emoji families are load-bearing: post bodies carry a typed ✅ and
        // 👀 as content (CLAUDE.md section 2). Without an explicit colour-emoji
        // family the browser can fall back to a monochrome glyph, which reads
        // as a broken font rather than as something a teenager typed.
        display: ['"Archivo"', "system-ui", "sans-serif"],
        ui: [
          '"Inter Tight"',
          "system-ui",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Noto Color Emoji"',
          "sans-serif",
        ],
        mono: [
          '"IBM Plex Mono"',
          "ui-monospace",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Noto Color Emoji"',
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["11px", { lineHeight: "14px" }],
        xs: ["13px", { lineHeight: "18px" }],
        sm: ["15px", { lineHeight: "22px" }],
        base: ["18px", { lineHeight: "26px" }],
        lg: ["24px", { lineHeight: "30px" }],
        xl: ["34px", { lineHeight: "38px" }],
        "2xl": ["56px", { lineHeight: "56px" }],
      },
      spacing: {
        1: "4px", 2: "8px", 3: "12px", 4: "16px",
        6: "24px", 8: "32px", 12: "48px", 18: "72px",
      },
      borderRadius: {
        doc: "2px",   // evidence cards - they are documents
        btn: "6px",
        post: "10px", // feed posts
        nova: "20px", // NOVA panel - organic, not a document
      },
      transitionTimingFunction: {
        real: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      gridTemplateColumns: {
        // deliberately unequal - see CLAUDE.md
        stage: "72px 620px 320px",
      },
    },
  },
  plugins: [],
};
