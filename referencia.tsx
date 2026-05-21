"use client";

import { useState } from "react";
import type { JSX } from "react";

const BUTTON_CSS = `
  @property --vbtn-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 135deg;
  }
  @property --vbtn-stop-a {
    syntax: '<color>';
    inherits: false;
    initial-value: oklch(0.72 0.16 55);
  }
  @property --vbtn-stop-b {
    syntax: '<color>';
    inherits: false;
    initial-value: oklch(0.55 0.22 285);
  }

  /* ── MD Primary ── */
  .pvbtn {
    --vbtn-stop-a: var(--vmc-color-orange-600);
    --vbtn-stop-b: var(--vmc-color-vault-500);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 0 56px;
    border-radius: var(--vmc-radius-full);
    border: 2.5px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: var(--vmc-font-display);
    font-size: 15px;
    font-weight: 600;
    color: var(--vmc-color-base-white);
    text-shadow: 0 1px 3px rgb(0% 0% 0% / 0.25);
    background-image:
      linear-gradient(var(--vbtn-angle), var(--vbtn-stop-a) 0%, var(--vbtn-stop-a) 40%, var(--vbtn-stop-b) 100%),
      linear-gradient(135deg,
        var(--vmc-color-base-white) 0%,
        var(--vmc-color-orange-400) 25%,
        var(--vmc-color-vault-400)  75%,
        var(--vmc-color-base-white) 100%
      );
    background-origin: padding-box, border-box;
    background-clip:   padding-box, border-box;
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.28),
      0 2px 6px rgb(92.94% 53.73% 21.18% / 0.30);
    transition:
      --vbtn-angle  0.4s  cubic-bezier(0.25, 0.8, 0.25, 1),
      --vbtn-stop-a 0.35s ease,
      --vbtn-stop-b 0.35s ease,
      transform     0.2s  cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow    0.25s ease;
    transform: translateZ(0);
  }
  .pvbtn::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.17) 0%, transparent 55%);
    pointer-events: none;
    z-index: 1;
  }
  .pvbtn::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(135deg, var(--vmc-color-orange-600), var(--vmc-color-vault-500));
    filter: blur(14px);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease, filter 0.3s ease;
  }
  .pvbtn:hover {
    --vbtn-angle:  220deg;
    --vbtn-stop-a: var(--vmc-color-orange-400);
    --vbtn-stop-b: var(--vmc-color-vault-400);
    transform: translateY(-2px) scale(1.02);
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.22),
      0 8px 24px rgb(51.76% 37.65% 89.8% / 0.35),
      0 4px 10px rgb(92.94% 53.73% 21.18% / 0.40);
  }
  .pvbtn:hover::after { opacity: 0.45; filter: blur(18px); }
  .pvbtn:active {
    --vbtn-angle:  135deg;
    --vbtn-stop-a: var(--vmc-color-orange-700);
    --vbtn-stop-b: var(--vmc-color-vault-600);
    transform: scale(0.97) translateY(1px);
    box-shadow:
      inset 0 2px 5px rgb(0% 0% 0% / 0.22),
      0 1px 3px rgb(0% 0% 0% / 0.12);
  }
  .pvbtn:active::after { opacity: 0; }
  .pvbtn:focus-visible {
    outline: 3px solid transparent;
    outline-offset: 4px;
    transform: scale(0.98);
    box-shadow:
      0 0 0 2px var(--vmc-color-base-white),
      0 0 0 5px var(--vmc-color-vault-500),
      0 8px 16px -4px rgb(51.76% 37.65% 89.8% / 0.30);
  }
  .pvbtn:focus-visible::after { opacity: 0.2; }
  .pvbtn:disabled {
    background-image: none;
    background-color: var(--vmc-color-background-disabled);
    color: var(--vmc-color-neutral-700);
    text-shadow: none;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
    border-color: transparent;
  }
  .pvbtn:disabled::after { display: none; }

  /* Frozen states */
  .pvbtn--hover {
    --vbtn-angle:  220deg;
    --vbtn-stop-a: var(--vmc-color-orange-400);
    --vbtn-stop-b: var(--vmc-color-vault-400);
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.22),
      0 8px 24px rgb(51.76% 37.65% 89.8% / 0.35),
      0 4px 10px rgb(92.94% 53.73% 21.18% / 0.40) !important;
  }
  .pvbtn--pressed {
    --vbtn-angle:  135deg;
    --vbtn-stop-a: var(--vmc-color-orange-700);
    --vbtn-stop-b: var(--vmc-color-vault-600);
    transform: scale(0.97) translateY(1px) !important;
    box-shadow:
      inset 0 2px 5px rgb(0% 0% 0% / 0.22),
      0 1px 3px rgb(0% 0% 0% / 0.12) !important;
  }
  .pvbtn--pressed::after { opacity: 0 !important; }

  /* ── SM variant — 40px, icon slot ── */
  .pvbtn-sm {
    --vbtn-stop-a: var(--vmc-color-orange-600);
    --vbtn-stop-b: var(--vmc-color-vault-500);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px 0 4px;
    border-radius: var(--vmc-radius-full);
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: var(--vmc-font-display);
    font-size: 14px;
    font-weight: 600;
    color: var(--vmc-color-base-white);
    text-shadow: 0 1px 2px rgb(0% 0% 0% / 0.20);
    background-image:
      linear-gradient(var(--vbtn-angle), var(--vbtn-stop-a) 0%, var(--vbtn-stop-a) 40%, var(--vbtn-stop-b) 100%),
      linear-gradient(135deg,
        var(--vmc-color-base-white) 0%,
        var(--vmc-color-orange-400) 25%,
        var(--vmc-color-vault-400) 75%,
        var(--vmc-color-base-white) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.25),
      0 2px 6px rgb(92.94% 53.73% 21.18% / 0.25);
    transition:
      --vbtn-angle  0.4s  cubic-bezier(0.25, 0.8, 0.25, 1),
      --vbtn-stop-a 0.35s ease,
      --vbtn-stop-b 0.35s ease,
      transform     0.2s  cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow    0.25s ease;
    transform: translateZ(0);
  }
  .pvbtn-sm::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.15) 0%, transparent 55%);
    pointer-events: none;
    z-index: 1;
  }
  .pvbtn-sm:hover {
    --vbtn-angle:  220deg;
    --vbtn-stop-a: var(--vmc-color-orange-400);
    --vbtn-stop-b: var(--vmc-color-vault-400);
    transform: translateY(-1px) scale(1.02);
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.20),
      0 6px 18px rgb(51.76% 37.65% 89.8% / 0.30),
      0 3px 8px rgb(92.94% 53.73% 21.18% / 0.35);
  }
  .pvbtn-sm:active {
    --vbtn-angle:  135deg;
    --vbtn-stop-a: var(--vmc-color-orange-700);
    --vbtn-stop-b: var(--vmc-color-vault-600);
    transform: scale(0.97) translateY(1px);
    box-shadow: inset 0 2px 4px rgb(0% 0% 0% / 0.22), 0 1px 2px rgb(0% 0% 0% / 0.10);
  }
  .pvbtn-sm:focus-visible {
    outline: none;
    transform: scale(0.98);
    box-shadow: 0 0 0 2px var(--vmc-color-base-white), 0 0 0 4px var(--vmc-color-vault-500);
  }

  .pvbtn-sm--hover {
    --vbtn-angle:  220deg;
    --vbtn-stop-a: var(--vmc-color-orange-400);
    --vbtn-stop-b: var(--vmc-color-vault-400);
    transform: translateY(-1px) scale(1.02) !important;
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.20),
      0 6px 18px rgb(51.76% 37.65% 89.8% / 0.30),
      0 3px 8px rgb(92.94% 53.73% 21.18% / 0.35) !important;
  }
  .pvbtn-sm--pressed {
    --vbtn-angle:  135deg;
    --vbtn-stop-a: var(--vmc-color-orange-700);
    --vbtn-stop-b: var(--vmc-color-vault-600);
    transform: scale(0.97) translateY(1px) !important;
    box-shadow: inset 0 2px 4px rgb(0% 0% 0% / 0.22), 0 1px 2px rgb(0% 0% 0% / 0.10) !important;
  }

  .pvbtn-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgb(100% 100% 100% / 0.20);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }

  /* ── SM Auth / Logged-in — cinematic dark variant ── */
  .pvbtn-auth {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px 0 4px;
    border-radius: var(--vmc-radius-full);
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: var(--vmc-font-display);
    font-size: 14px;
    font-weight: 500;
    color: var(--vmc-color-base-white);
    /* Fill: vault gradient con profundidad · Ring: naranja dominante → vault claro */
    background-image:
      linear-gradient(135deg, var(--vmc-color-vault-700) 0%, var(--vmc-color-vault-900) 100%),
      linear-gradient(135deg,
        var(--vmc-color-orange-600) 0%,
        var(--vmc-color-orange-400) 45%,
        var(--vmc-color-vault-400) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.15),
      0 0 16px rgb(92.94% 53.73% 21.18% / 0.25);
    transition:
      transform     0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow    0.25s ease;
    transform: translateZ(0);
  }
  /* Inset shine — mismo tratamiento que pvbtn */
  .pvbtn-auth::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.12) 0%, transparent 55%);
    pointer-events: none;
    z-index: 1;
  }
  /* Split-chroma glow detrás */
  .pvbtn-auth::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(135deg, var(--vmc-color-orange-600), var(--vmc-color-vault-500));
    filter: blur(12px);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  .pvbtn-auth:hover {
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.18),
      0 0 24px rgb(92.94% 53.73% 21.18% / 0.40),
      0 4px 16px rgb(13.33% 0% 36.08% / 0.50);
  }
  .pvbtn-auth:hover::after { opacity: 0.35; }
  .pvbtn-auth:active {
    transform: scale(0.97) translateY(1px);
    box-shadow: inset 0 2px 5px rgb(0% 0% 0% / 0.35), 0 1px 2px rgb(0% 0% 0% / 0.15);
  }
  .pvbtn-auth:active::after { opacity: 0; }
  .pvbtn-auth:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px var(--vmc-color-vault-900),
      0 0 0 4px var(--vmc-color-orange-500),
      0 0 12px rgb(92.94% 53.73% 21.18% / 0.30);
  }

  .pvbtn-auth-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgb(92.94% 53.73% 21.18% / 0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }
  .pvbtn-auth-username {
    color: var(--vmc-color-orange-400);
    font-weight: 700;
    text-shadow: 0 0 8px rgb(92.94% 53.73% 21.18% / 0.55);
  }

  /* ── Auth B — Glass: fill casi transparente, ring naranja define forma ── */
  .pvbtn-auth-b {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px 0 4px;
    border-radius: var(--vmc-radius-full);
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: var(--vmc-font-display);
    font-size: 14px;
    font-weight: 500;
    color: var(--vmc-color-base-white);
    background-image:
      linear-gradient(135deg, rgb(13.33% 0% 36.08% / 0.35), rgb(13.33% 0% 36.08% / 0.55)),
      linear-gradient(135deg,
        var(--vmc-color-orange-500) 0%,
        var(--vmc-color-orange-400) 40%,
        var(--vmc-color-vault-400) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow: inset 0 1px 0 rgb(100% 100% 100% / 0.10);
    transition: transform 0.2s ease, box-shadow 0.25s ease;
    transform: translateZ(0);
  }
  .pvbtn-auth-b::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.08) 0%, transparent 55%);
    pointer-events: none;
    z-index: 1;
  }
  .pvbtn-auth-b:hover {
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.14),
      0 0 20px rgb(92.94% 53.73% 21.18% / 0.30);
  }
  .pvbtn-auth-b:active {
    transform: scale(0.97) translateY(1px);
    box-shadow: inset 0 2px 4px rgb(0% 0% 0% / 0.25);
  }
  .pvbtn-auth-b-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgb(100% 100% 100% / 0.10);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }
  .pvbtn-auth-b-username {
    color: var(--vmc-color-orange-400);
    font-weight: 700;
  }

  /* ── Auth C — Warm Dark: fill con tinte naranja, ring dorado-cálido ── */
  .pvbtn-auth-c {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px 0 4px;
    border-radius: var(--vmc-radius-full);
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: var(--vmc-font-display);
    font-size: 14px;
    font-weight: 500;
    color: var(--vmc-color-base-white);
    /* Fill: vault oscuro con undertone naranja en top-left */
    background-image:
      linear-gradient(135deg,
        color-mix(in oklch, var(--vmc-color-vault-800) 80%, var(--vmc-color-orange-900)) 0%,
        var(--vmc-color-vault-900) 100%
      ),
      linear-gradient(135deg,
        var(--vmc-color-orange-400) 0%,
        var(--vmc-color-orange-600) 35%,
        var(--vmc-color-vault-500) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.12),
      inset 0 0 32px rgb(92.94% 53.73% 21.18% / 0.08);
    transition: transform 0.2s ease, box-shadow 0.25s ease;
    transform: translateZ(0);
  }
  .pvbtn-auth-c::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.10) 0%, transparent 55%);
    pointer-events: none;
    z-index: 1;
  }
  .pvbtn-auth-c::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(135deg, var(--vmc-color-orange-600), var(--vmc-color-vault-500));
    filter: blur(12px);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  .pvbtn-auth-c:hover {
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.16),
      inset 0 0 32px rgb(92.94% 53.73% 21.18% / 0.12),
      0 0 22px rgb(92.94% 53.73% 21.18% / 0.35),
      0 4px 14px rgb(13.33% 0% 36.08% / 0.45);
  }
  .pvbtn-auth-c:hover::after { opacity: 0.30; }
  .pvbtn-auth-c:active {
    transform: scale(0.97) translateY(1px);
    box-shadow: inset 0 2px 5px rgb(0% 0% 0% / 0.30);
  }
  .pvbtn-auth-c-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: color-mix(in oklch, var(--vmc-color-orange-900) 60%, rgb(100% 100% 100% / 0.05));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }
  .pvbtn-auth-c-username {
    color: var(--vmc-color-orange-300);
    font-weight: 700;
    text-shadow: 0 0 10px rgb(92.94% 53.73% 21.18% / 0.45);
  }

  /* ── Auth D — Primary Clone: mismo fill naranja→vault que "Participa" ── */
  .pvbtn-auth-d {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px 0 4px;
    border-radius: var(--vmc-radius-full);
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: var(--vmc-font-display);
    font-size: 14px;
    font-weight: 600;
    color: var(--vmc-color-base-white);
    text-shadow: 0 1px 2px rgb(0% 0% 0% / 0.22);
    background-image:
      linear-gradient(var(--vbtn-angle), var(--vbtn-stop-a) 0%, var(--vbtn-stop-a) 40%, var(--vbtn-stop-b) 100%),
      linear-gradient(135deg,
        var(--vmc-color-base-white) 0%,
        var(--vmc-color-orange-400) 25%,
        var(--vmc-color-vault-400) 75%,
        var(--vmc-color-base-white) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.28),
      0 2px 6px rgb(92.94% 53.73% 21.18% / 0.30);
    transition:
      --vbtn-angle  0.4s  cubic-bezier(0.25, 0.8, 0.25, 1),
      --vbtn-stop-a 0.35s ease,
      --vbtn-stop-b 0.35s ease,
      transform     0.2s  cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow    0.25s ease;
    transform: translateZ(0);
  }
  .pvbtn-auth-d::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.17) 0%, transparent 55%);
    pointer-events: none;
    z-index: 1;
  }
  .pvbtn-auth-d::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(135deg, var(--vmc-color-orange-600), var(--vmc-color-vault-500));
    filter: blur(12px);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  .pvbtn-auth-d:hover {
    --vbtn-angle:  220deg;
    --vbtn-stop-a: var(--vmc-color-orange-400);
    --vbtn-stop-b: var(--vmc-color-vault-400);
    transform: translateY(-1px) scale(1.02);
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.22),
      0 8px 20px rgb(51.76% 37.65% 89.8% / 0.35),
      0 4px 10px rgb(92.94% 53.73% 21.18% / 0.40);
  }
  .pvbtn-auth-d:hover::after { opacity: 0.40; filter: blur(16px); }
  .pvbtn-auth-d:active {
    --vbtn-angle:  135deg;
    --vbtn-stop-a: var(--vmc-color-orange-700);
    --vbtn-stop-b: var(--vmc-color-vault-600);
    transform: scale(0.97) translateY(1px);
    box-shadow: inset 0 2px 5px rgb(0% 0% 0% / 0.22), 0 1px 2px rgb(0% 0% 0% / 0.10);
  }
  .pvbtn-auth-d-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgb(0% 0% 0% / 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }
  .pvbtn-auth-d-username {
    font-weight: 700;
    opacity: 0.92;
  }

  /* ── Auth E — Vault→Orange invertido: vault izq, naranja der, username blanco ── */
  .pvbtn-auth-e {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px 0 4px;
    border-radius: var(--vmc-radius-full);
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: var(--vmc-font-display);
    font-size: 14px;
    font-weight: 600;
    color: var(--vmc-color-base-white);
    text-shadow: 0 1px 2px rgb(0% 0% 0% / 0.25);
    background-image:
      linear-gradient(135deg,
        var(--vmc-color-vault-600) 0%,
        var(--vmc-color-vault-500) 45%,
        var(--vmc-color-orange-500) 100%
      ),
      linear-gradient(135deg,
        var(--vmc-color-vault-400) 0%,
        var(--vmc-color-base-white) 40%,
        var(--vmc-color-orange-400) 75%,
        var(--vmc-color-base-white) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.22),
      0 2px 8px rgb(51.76% 37.65% 89.8% / 0.35);
    transition:
      transform     0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow    0.25s ease;
    transform: translateZ(0);
  }
  .pvbtn-auth-e::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.15) 0%, transparent 55%);
    pointer-events: none;
    z-index: 1;
  }
  .pvbtn-auth-e::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(135deg, var(--vmc-color-vault-500), var(--vmc-color-orange-500));
    filter: blur(12px);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  .pvbtn-auth-e:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.20),
      0 8px 22px rgb(51.76% 37.65% 89.8% / 0.40),
      0 4px 10px rgb(92.94% 53.73% 21.18% / 0.35);
  }
  .pvbtn-auth-e:hover::after { opacity: 0.38; }
  .pvbtn-auth-e:active {
    transform: scale(0.97) translateY(1px);
    box-shadow: inset 0 2px 5px rgb(0% 0% 0% / 0.25), 0 1px 2px rgb(0% 0% 0% / 0.10);
  }
  .pvbtn-auth-e-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgb(100% 100% 100% / 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }
  .pvbtn-auth-e-username {
    font-weight: 700;
    color: var(--vmc-color-orange-200);
  }

  /* ── Auth F — Split: mitad izq vault-oscuro, mitad der naranja quemado ── */
  .pvbtn-auth-f {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px 0 4px;
    border-radius: var(--vmc-radius-full);
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: var(--vmc-font-display);
    font-size: 14px;
    font-weight: 600;
    color: var(--vmc-color-base-white);
    text-shadow: 0 1px 3px rgb(0% 0% 0% / 0.30);
    background-image:
      linear-gradient(100deg,
        var(--vmc-color-vault-800) 0%,
        var(--vmc-color-vault-700) 38%,
        var(--vmc-color-orange-600) 62%,
        var(--vmc-color-orange-500) 100%
      ),
      linear-gradient(135deg,
        var(--vmc-color-vault-500) 0%,
        var(--vmc-color-orange-400) 50%,
        var(--vmc-color-orange-300) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.20),
      0 2px 8px rgb(92.94% 53.73% 21.18% / 0.35),
      0 2px 8px rgb(51.76% 37.65% 89.8% / 0.20);
    transition:
      transform     0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow    0.25s ease;
    transform: translateZ(0);
  }
  .pvbtn-auth-f::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.14) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
  .pvbtn-auth-f::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(100deg, var(--vmc-color-vault-600), var(--vmc-color-orange-500));
    filter: blur(14px);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  .pvbtn-auth-f:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.18),
      0 8px 22px rgb(92.94% 53.73% 21.18% / 0.45),
      0 4px 12px rgb(51.76% 37.65% 89.8% / 0.30);
  }
  .pvbtn-auth-f:hover::after { opacity: 0.45; filter: blur(18px); }
  .pvbtn-auth-f:active {
    transform: scale(0.97) translateY(1px);
    box-shadow: inset 0 2px 5px rgb(0% 0% 0% / 0.28), 0 1px 2px rgb(0% 0% 0% / 0.12);
  }
  .pvbtn-auth-f-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgb(0% 0% 0% / 0.20);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }
  .pvbtn-auth-f-username {
    font-weight: 700;
    color: var(--vmc-color-orange-200);
    text-shadow: 0 0 8px rgb(92.94% 53.73% 21.18% / 0.50);
  }

  /* ── MD Secondary — vault-dominant, mismo sistema cinematic ── */
  @property --vsec-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 160deg;
  }
  @property --vsec-stop-a {
    syntax: '<color>';
    inherits: false;
    initial-value: oklch(0.38 0.20 285);
  }
  @property --vsec-stop-b {
    syntax: '<color>';
    inherits: false;
    initial-value: oklch(0.28 0.18 285);
  }

  .psec {
    --vsec-stop-a: var(--vmc-color-vault-500);
    --vsec-stop-b: var(--vmc-color-vault-700);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 0 56px;
    border-radius: var(--vmc-radius-full);
    border: 2.5px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: var(--vmc-font-display);
    font-size: 15px;
    font-weight: 600;
    color: var(--vmc-color-base-white);
    text-shadow: 0 1px 3px rgb(0% 0% 0% / 0.30);
    background-image:
      linear-gradient(var(--vsec-angle), var(--vsec-stop-a) 0%, var(--vsec-stop-b) 100%),
      linear-gradient(135deg,
        var(--vmc-color-vault-300) 0%,
        var(--vmc-color-base-white) 35%,
        var(--vmc-color-vault-400) 65%,
        var(--vmc-color-vault-300) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.22),
      0 2px 8px rgb(51.76% 37.65% 89.8% / 0.30);
    transition:
      --vsec-angle  0.4s  cubic-bezier(0.25, 0.8, 0.25, 1),
      --vsec-stop-a 0.35s ease,
      --vsec-stop-b 0.35s ease,
      transform     0.2s  cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow    0.25s ease;
    transform: translateZ(0);
  }
  .psec::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.16) 0%, transparent 55%);
    pointer-events: none;
    z-index: 1;
  }
  .psec::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(135deg, var(--vmc-color-vault-400), var(--vmc-color-vault-600));
    filter: blur(14px);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease, filter 0.3s ease;
  }
  .psec:hover {
    --vsec-angle:  220deg;
    --vsec-stop-a: var(--vmc-color-vault-400);
    --vsec-stop-b: var(--vmc-color-vault-600);
    transform: translateY(-2px) scale(1.02);
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.20),
      0 8px 24px rgb(51.76% 37.65% 89.8% / 0.40),
      0 4px 10px rgb(51.76% 37.65% 89.8% / 0.25);
  }
  .psec:hover::after { opacity: 0.45; filter: blur(18px); }
  .psec:active {
    --vsec-angle:  160deg;
    --vsec-stop-a: var(--vmc-color-vault-700);
    --vsec-stop-b: var(--vmc-color-vault-900);
    transform: scale(0.97) translateY(1px);
    box-shadow:
      inset 0 2px 5px rgb(0% 0% 0% / 0.28),
      0 1px 3px rgb(0% 0% 0% / 0.14);
  }
  .psec:active::after { opacity: 0; }
  .psec:focus-visible {
    outline: none;
    transform: scale(0.98);
    box-shadow:
      0 0 0 2px var(--vmc-color-base-white),
      0 0 0 5px var(--vmc-color-vault-400),
      0 8px 16px -4px rgb(51.76% 37.65% 89.8% / 0.35);
  }
  .psec:disabled {
    background-image: none;
    background-color: var(--vmc-color-background-disabled);
    color: var(--vmc-color-neutral-700);
    text-shadow: none;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
    border-color: transparent;
  }
  .psec:disabled::after { display: none; }

  .psec--hover {
    --vsec-angle:  220deg;
    --vsec-stop-a: var(--vmc-color-vault-400);
    --vsec-stop-b: var(--vmc-color-vault-600);
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.20),
      0 8px 24px rgb(51.76% 37.65% 89.8% / 0.40),
      0 4px 10px rgb(51.76% 37.65% 89.8% / 0.25) !important;
  }
  .psec--pressed {
    --vsec-angle:  160deg;
    --vsec-stop-a: var(--vmc-color-vault-700);
    --vsec-stop-b: var(--vmc-color-vault-900);
    transform: scale(0.97) translateY(1px) !important;
    box-shadow:
      inset 0 2px 5px rgb(0% 0% 0% / 0.28),
      0 1px 3px rgb(0% 0% 0% / 0.14) !important;
  }
  .psec--pressed::after { opacity: 0 !important; }

  /* ── MD Ghost — sobre fondo naranja/live ── */
  .pghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 0 28px;
    border-radius: var(--vmc-radius-full);
    border: 2px solid rgb(100% 100% 100% / 0.75);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: var(--vmc-font-display);
    font-size: 14px;
    font-weight: 600;
    color: var(--vmc-color-base-white);
    background: transparent;
    text-shadow: 0 1px 3px rgb(0% 0% 0% / 0.18);
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.20),
      0 0 0 1px rgb(100% 100% 100% / 0.15);
    transition:
      background    0.25s ease,
      border-color  0.25s ease,
      color         0.25s ease,
      transform     0.2s  cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow    0.25s ease;
    transform: translateZ(0);
  }
  /* Inset shine */
  .pghost::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--vmc-radius-full);
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.10) 0%, transparent 55%);
    pointer-events: none;
    z-index: 1;
  }
  /* White glow */
  .pghost::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: var(--vmc-radius-full);
    background: rgb(100% 100% 100% / 0.60);
    filter: blur(14px);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease, filter 0.3s ease;
  }
  .pghost:hover {
    background: linear-gradient(135deg, rgb(100% 100% 100% / 1) 0%, oklch(0.97 0.03 55) 100%);
    border-color: rgb(100% 100% 100% / 1);
    color: var(--vmc-color-orange-600);
    text-shadow: none;
    transform: translateY(-2px) scale(1.02);
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.50),
      0 6px 20px rgb(0% 0% 0% / 0.20);
  }
  .pghost:hover::after { opacity: 0.40; filter: blur(18px); }
  .pghost:active {
    background: linear-gradient(135deg, var(--vmc-color-orange-700) 0%, oklch(0.52 0.18 45) 100%);
    border-color: var(--vmc-color-orange-700);
    color: var(--vmc-color-base-white);
    text-shadow: 0 1px 3px rgb(0% 0% 0% / 0.25);
    transform: scale(0.97) translateY(1px);
    box-shadow: inset 0 2px 5px rgb(0% 0% 0% / 0.22);
  }
  .pghost:active::after { opacity: 0; }
  .pghost:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px var(--vmc-color-orange-600),
      0 0 0 4px rgb(100% 100% 100% / 0.80);
  }
  .pghost:disabled {
    background: transparent;
    border-color: rgb(100% 100% 100% / 0.30);
    color: rgb(100% 100% 100% / 0.35);
    text-shadow: none;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .pghost:disabled::after { display: none; }

  .pghost--hover {
    background: linear-gradient(135deg, rgb(100% 100% 100% / 1) 0%, oklch(0.97 0.03 55) 100%) !important;
    border-color: rgb(100% 100% 100% / 1) !important;
    color: var(--vmc-color-orange-600) !important;
    text-shadow: none !important;
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow:
      inset 0 1px 0 rgb(100% 100% 100% / 0.50),
      0 6px 20px rgb(0% 0% 0% / 0.20) !important;
  }
  .pghost--pressed {
    background: linear-gradient(135deg, var(--vmc-color-orange-700) 0%, oklch(0.52 0.18 45) 100%) !important;
    border-color: var(--vmc-color-orange-700) !important;
    color: var(--vmc-color-base-white) !important;
    transform: scale(0.97) translateY(1px) !important;
    box-shadow: inset 0 2px 5px rgb(0% 0% 0% / 0.22) !important;
  }

  /* ── LikeButton · Cinematic upgrade ── */
  .plike {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    /* Gradient ring: white fill + vault shimmer border */
    background-image:
      linear-gradient(180deg, rgb(100% 100% 100%) 0%, rgb(100% 100% 100%) 100%),
      linear-gradient(135deg,
        var(--vmc-color-vault-200, oklch(0.87 0.09 285)) 0%,
        rgb(100% 100% 100%) 40%,
        var(--vmc-color-vault-300, oklch(0.80 0.12 285)) 75%,
        var(--vmc-color-vault-200, oklch(0.87 0.09 285)) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow: 0 2px 8px rgb(51.76% 37.65% 89.8% / 0.14);
    transition:
      transform     0.2s  cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow    0.25s ease,
      background-image 0.25s ease;
    transform: translateZ(0);
  }
  /* Inset shine */
  .plike::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.55) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
  /* Vault glow */
  .plike::after {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--vmc-color-vault-400) 0%, transparent 70%);
    filter: blur(10px);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  .plike:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow:
      0 10px 18px oklch(0.22 0.18 285 / 0.22),
      0  3px  6px oklch(0.22 0.18 285 / 0.12);
  }
  /* ::after stays opacity 0 — no radial blob */
  .plike:active { transform: scale(0.92); }

  /* Sizes */
  .plike--sm { width: 32px; height: 32px; }
  .plike--md { width: 44px; height: 44px; }
  .plike--lg { width: 60px; height: 60px; }

  /* Active/liked — vault gradient fill + orange→vault ring */
  .plike--active {
    background-image:
      linear-gradient(135deg,
        var(--vmc-color-vault-500, oklch(0.45 0.20 285)) 0%,
        var(--vmc-color-vault-700, oklch(0.30 0.20 285)) 100%
      ),
      linear-gradient(135deg,
        var(--vmc-color-orange-400) 0%,
        rgb(100% 100% 100%) 40%,
        var(--vmc-color-vault-400, oklch(0.55 0.20 285)) 75%,
        var(--vmc-color-vault-300, oklch(0.80 0.12 285)) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow:
      0 3px 14px rgb(51.76% 37.65% 89.8% / 0.35),
      inset 0 1px 0 rgb(100% 100% 100% / 0.22);
  }
  .plike--active::before {
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.18) 0%, transparent 50%);
  }
  .plike--active::after { opacity: 0.35; }
  .plike--active:hover::after { opacity: 0.60; }

  /* Heart pop — played when active class applied */
  @keyframes plike-heart-pop {
    0%   { transform: scale(1); }
    35%  { transform: scale(1.40); }
    65%  { transform: scale(0.85); }
    85%  { transform: scale(1.10); }
    100% { transform: scale(1); }
  }
  .plike--active svg {
    animation: plike-heart-pop 0.38s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Disabled */
  .plike--disabled {
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.40;
    pointer-events: none;
  }
  .plike--disabled::after { display: none; }

  /* Skeleton */
  .plike--skeleton {
    background-image: none;
    background-color: var(--vmc-color-background-disabled, oklch(0.88 0.01 220));
    border-color: transparent;
    box-shadow: none;
    cursor: default;
    pointer-events: none;
    animation: plike-pulse 1.6s ease-in-out infinite;
  }
  .plike--skeleton::before { display: none; }
  .plike--skeleton::after  { display: none; }

  @keyframes plike-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.40; }
  }

  /* ── PriceIcon · Cinematic upgrade ── */
  .pprice-wrap {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .pprice {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    /* Teal fill + shimmer ring */
    background-image:
      linear-gradient(135deg,
        var(--vmc-color-negotiable, oklch(0.78 0.14 195)) 0%,
        oklch(0.65 0.16 195) 100%
      ),
      linear-gradient(135deg,
        oklch(0.88 0.08 195) 0%,
        rgb(100% 100% 100%) 40%,
        oklch(0.72 0.14 195) 75%,
        oklch(0.88 0.08 195) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow: 0 2px 8px oklch(0.78 0.14 195 / 0.25);
    transition:
      transform   0.2s  cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow  0.25s ease;
    transform: translateZ(0);
  }
  /* Inset shine */
  .pprice::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(180deg, rgb(100% 100% 100% / 0.45) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
  /* Teal glow */
  .pprice::after {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--vmc-color-negotiable, oklch(0.78 0.14 195)) 0%, transparent 70%);
    filter: blur(10px);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  /* Sizes */
  .pprice--sm { width: 32px; height: 32px; }
  .pprice--md { width: 44px; height: 44px; }
  .pprice--lg { width: 60px; height: 60px; }

  /* Disabled */
  .pprice-wrap--disabled .pprice {
    background-image:
      linear-gradient(135deg, oklch(0.82 0.02 220) 0%, oklch(0.76 0.02 220) 100%),
      linear-gradient(135deg, oklch(0.88 0.01 220) 0%, oklch(0.88 0.01 220) 100%);
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow: none;
    cursor: default;
    pointer-events: none;
    opacity: 0.55;
  }
  .pprice-wrap--disabled .pprice::before { display: none; }
  .pprice-wrap--disabled .pprice::after  { display: none; }

  /* Skeleton */
  .pprice-wrap--skeleton .pprice {
    background-image: none;
    background-color: var(--vmc-color-background-disabled, oklch(0.88 0.01 220));
    border-color: transparent;
    box-shadow: none;
    cursor: default;
    pointer-events: none;
    animation: plike-pulse 1.6s ease-in-out infinite;
  }
  .pprice-wrap--skeleton .pprice::before { display: none; }
  .pprice-wrap--skeleton .pprice::after  { display: none; }
  .pprice-wrap--skeleton .pprice-shelf   { display: none; }

  /* ── PriceIcon shelf — Contact shadow ── */
  .pprice-shelf {
    border-radius: 50%;
    background: oklch(0.62 0.15 195 / 0.50);
    filter: blur(5px);
  }
  .pprice-wrap--sm .pprice-shelf { width: 26px; height: 6px;  margin-top: 4px; }
  .pprice-wrap--md .pprice-shelf { width: 36px; height: 8px;  margin-top: 5px; }
  .pprice-wrap--lg .pprice-shelf { width: 50px; height: 10px; margin-top: 6px; }

  /* Disabled: shelf invisible pero mantiene posición */
  .pprice-wrap--disabled .pprice-shelf { visibility: hidden; }

  /* ── OfferType · cinematic card ── */
  .poftype {
    width: 110px;
    border-radius: var(--vmc-radius-md, 8px);
    overflow: hidden;
    cursor: pointer;
    position: relative;
    box-shadow:
      0 4px 16px oklch(0 0 0 / 0.12),
      0 1px 4px  oklch(0 0 0 / 0.06);
    transition:
      transform  0.2s  cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow 0.25s ease;
    transform: translateZ(0);
    outline: none;
  }

  /* Top colored section */
  .poftype-top {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    transition: background 0.22s ease;
  }
  /* Inset shine — muy sutil, colores vivos no aguantan brillo fuerte */
  .poftype-top::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,
      oklch(1 0 0 / 0.07) 0%,
      transparent 60%
    );
    pointer-events: none;
    z-index: 1;
  }
  /* Bottom edge separator */
  .poftype-top::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(180deg, transparent 0%, oklch(0 0 0 / 0.08) 100%);
    pointer-events: none;
    z-index: 1;
  }

  .poftype-label {
    font-family: var(--vmc-font-display);
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: oklch(1 0 0);
    text-shadow: 0 1px 3px oklch(0 0 0 / 0.25);
    position: relative;
    z-index: 2;
  }

  /* Bottom white section */
  .poftype-bottom {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: oklch(1 0 0);
  }
  .poftype-cta {
    font-family: var(--vmc-font-display);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.10em;
    transition: color 0.22s ease;
  }

  /* ── Variant: NEGOCIABLE ── */
  .poftype--negotiable {
    box-shadow:
      0 0 0 1.5px oklch(0.78 0.14 195 / 0.40),
      0 4px 14px oklch(0 0 0 / 0.10),
      0 1px 4px  oklch(0 0 0 / 0.06);
  }
  .poftype--negotiable .poftype-top {
    background: linear-gradient(180deg,
      oklch(0.84 0.13 195) 0%,
      var(--vmc-color-negotiable, oklch(0.78 0.14 195)) 100%
    );
  }
  .poftype--negotiable .poftype-bottom {
    background: color-mix(in oklch,
      oklch(1 0 0) 95%,
      var(--vmc-color-negotiable, oklch(0.78 0.14 195))
    );
  }
  .poftype--negotiable .poftype-cta {
    color: oklch(0.58 0.17 195);
  }

  /* Hover */
  .poftype--negotiable:hover,
  .poftype--negotiable.poftype--hover {
    box-shadow:
      0 0 0 1.5px oklch(0.78 0.14 195 / 0.55),
      0 10px 18px oklch(0.22 0.18 285 / 0.11),
      0  3px  7px oklch(0.22 0.18 285 / 0.08),
      0  1px  2px oklch(0.22 0.18 285 / 0.05);
  }
  /* Focus / pressed */
  .poftype--negotiable.poftype--focus .poftype-top {
    background: linear-gradient(180deg,
      oklch(0.65 0.17 195) 0%,
      oklch(0.55 0.16 195) 100%
    );
  }

  /* ── Variant: EN VIVO ── */
  .poftype--live {
    box-shadow:
      0 0 0 1.5px oklch(0.72 0.16 55 / 0.40),
      0 4px 14px oklch(0 0 0 / 0.10),
      0 1px 4px  oklch(0 0 0 / 0.06);
  }
  .poftype--live .poftype-top {
    background: linear-gradient(180deg,
      oklch(0.78 0.17 55) 0%,
      var(--vmc-color-live, oklch(0.72 0.16 55)) 100%
    );
  }
  .poftype--live .poftype-bottom {
    background: color-mix(in oklch,
      oklch(1 0 0) 95%,
      var(--vmc-color-live, oklch(0.72 0.16 55))
    );
  }
  .poftype--live .poftype-cta {
    color: oklch(0.54 0.18 45);
  }

  /* Hover */
  .poftype--live:hover,
  .poftype--live.poftype--hover {
    box-shadow:
      0 0 0 1.5px oklch(0.72 0.16 55 / 0.55),
      0 10px 18px oklch(0.22 0.18 285 / 0.11),
      0  3px  7px oklch(0.22 0.18 285 / 0.08),
      0  1px  2px oklch(0.22 0.18 285 / 0.05);
  }
  /* Focus / pressed */
  .poftype--live.poftype--focus .poftype-top {
    background: linear-gradient(180deg,
      oklch(0.58 0.19 48) 0%,
      oklch(0.50 0.17 44) 100%
    );
  }

  /* ── Shared hover — lift + micro-scale, sensación premium ── */
  .poftype:hover,
  .poftype--hover {
    transform: translateY(-4px) scale(1.015);
  }

  /* Shine amplificado en hover (ambas variantes) */
  .poftype:hover .poftype-top::before,
  .poftype--hover .poftype-top::before {
    background: linear-gradient(180deg, oklch(1 0 0 / 0.26) 0%, transparent 50%);
  }

  /* ── Focus / pressed — opacity total igual que pcatcard ── */
  .poftype--focus {
    transform: scale(0.97) !important;
    opacity: 0.58;
    box-shadow:
      0 2px 8px oklch(0 0 0 / 0.10),
      inset 0 2px 6px oklch(0 0 0 / 0.12) !important;
  }

  /* ── QuickFilter ── */
  .pqf {
    width: 100%;
    height: 180px;
    background: oklch(1 0 0);
    border-radius: var(--vmc-radius-md, 8px);
    border: 1px solid oklch(0.22 0.18 285 / 0.07);
    box-shadow: 0 2px 10px oklch(0.22 0.18 285 / 0.06);
    display: flex;
    align-items: stretch;
    overflow: hidden;
  }
  .pqf-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 14px;
    padding: 0 24px;
  }
  .pqf-section--offer {
    flex: 0 0 auto;
    border-right: 1px solid oklch(0.22 0.18 285 / 0.07);
  }
  .pqf-section--cats {
    flex: 1;
  }
  .pqf-heading {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .pqf-heading::before {
    content: '';
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-top: 2px solid var(--vmc-color-vault, oklch(0.22 0.18 285));
    border-left: 2px solid var(--vmc-color-vault, oklch(0.22 0.18 285));
  }
  .pqf-heading-text {
    font-family: var(--vmc-font-display);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: oklch(0.22 0.18 285 / 0.45);
  }
  .pqf-items {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  /* ── CategoryCard · cinematic upgrade ── */
  .pcatcard {
    width: 93px;
    height: 92px;
    border-radius: var(--vmc-radius-md, 8px);
    border: 1.5px solid transparent;
    /* Gradient ring — mismo patrón pvbtn/plike/pprice */
    background-image:
      linear-gradient(160deg, oklch(1 0 0) 0%, oklch(0.97 0.006 285) 100%),
      linear-gradient(135deg,
        oklch(0.72 0.14 285) 0%,
        oklch(1 0 0 / 0.65) 38%,
        oklch(0.58 0.18 285) 70%,
        oklch(0.72 0.14 285) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    gap: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow:
      0 2px 10px oklch(0.22 0.18 285 / 0.08),
      0 1px 3px  oklch(0.22 0.18 285 / 0.05);
    transition:
      transform  0.2s  cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow 0.22s ease;
    transform: translateZ(0);
    outline: none;
  }
  /* Inset shine */
  .pcatcard::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(160deg, oklch(1 0 0 / 0.55) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
  /* Vault glow */
  .pcatcard::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: inherit;
    background: radial-gradient(ellipse at 50% 60%,
      oklch(0.40 0.20 285 / 0.22) 0%, transparent 70%
    );
    filter: blur(8px);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.28s ease;
  }
  /* Icon wrap — sin background, icono directo sobre la card */
  .pcatcard-icon-wrap {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--vmc-color-vault, oklch(0.22 0.18 285));
    position: relative;
    z-index: 2;
  }
  .pcatcard-label {
    font-family: var(--vmc-font-display);
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--vmc-color-vault, oklch(0.22 0.18 285));
    text-align: center;
    line-height: 1.35;
    position: relative;
    z-index: 2;
  }
  /*
    HOVER v1 — ARCHIVADO (restaurar si se desea volver)
    .pcatcard:hover { transform: translateY(-2px) scale(1.02);
      box-shadow: 0 6px 20px vault/0.16, 0 2px 6px vault/0.08; }
    .pcatcard:hover::after { opacity: 1; }  ← radial blob glow vault
    plike:hover { transform: scale(1.10) translateY(-1px);
      box-shadow: 0 5px 18px vault-rgb/0.26; }
    .plike:hover::after { opacity: 0.55; }  ← radial blob glow vault
  */

  /* Hover v2 — lift + ring intensificado + glow suave */
  .pcatcard:hover,
  .pcatcard--hover {
    transform: translateY(-4px);
    box-shadow:
      0 12px 20px oklch(0.22 0.18 285 / 0.14),
      0  4px  8px oklch(0.22 0.18 285 / 0.10),
      0  1px  2px oklch(0.22 0.18 285 / 0.06);
    background-image:
      linear-gradient(160deg, oklch(0.97 0.010 285) 0%, oklch(0.99 0.004 285) 100%),
      linear-gradient(135deg,
        oklch(0.52 0.22 285) 0%,
        oklch(1 0 0 / 0.80) 38%,
        oklch(0.40 0.24 285) 72%,
        oklch(0.52 0.22 285) 100%
      );
  }
  .pcatcard:hover::after,
  .pcatcard--hover::after {
    opacity: 0.30;
  }
  /* icon-wrap sin cambio en hover — sin background que cambiar */
  /* Focus / pressed */
  .pcatcard--focus {
    transform: scale(0.96) !important;
    opacity: 0.58;
    background-image:
      linear-gradient(160deg, oklch(0.94 0.012 285) 0%, oklch(0.90 0.018 285) 100%),
      linear-gradient(135deg,
        oklch(0.72 0.14 285) 0%,
        oklch(1 0 0 / 0.65) 38%,
        oklch(0.58 0.18 285) 70%,
        oklch(0.72 0.14 285) 100%
      ) !important;
    box-shadow:
      0 1px 5px oklch(0.22 0.18 285 / 0.12),
      inset 0 1px 3px oklch(0.22 0.18 285 / 0.08) !important;
  }

  /* ── PriceTag · cinematic vault pill ── */
  .ptag {
    display: inline-flex;
    align-items: center;
    border-radius: var(--vmc-radius-full, 9999px);
    border: 1.5px solid transparent;
    background-image:
      linear-gradient(135deg,
        oklch(0.48 0.24 285) 0%,
        oklch(0.48 0.24 285) 30%,
        oklch(0.20 0.17 285) 100%
      ),
      linear-gradient(135deg,
        oklch(0.65 0.20 285) 0%,
        oklch(1 0 0 / 0.40) 38%,
        oklch(0.45 0.22 285) 68%,
        oklch(0.65 0.20 285) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow:
      0 3px 16px oklch(0.22 0.18 285 / 0.55),
      inset 0 1px 0 oklch(1 0 0 / 0.10);
    position: relative;
    overflow: visible;
  }
  /* Inset shine */
  .ptag::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(180deg, oklch(1 0 0 / 0.07) 0%, transparent 55%);
    pointer-events: none;
  }

  /* Sizes */
  .ptag--sm { height: 26px; padding: 0 10px 0 3px; gap: 5px; }
  .ptag--md { height: 32px; padding: 0 14px 0 4px; gap: 7px; }
  .ptag--lg { height: 40px; padding: 0 18px 0 5px; gap: 9px; }

  /* Teal $ icon inside tag */
  .ptag-icon {
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1.5px solid transparent;
    background-image:
      linear-gradient(135deg,
        var(--vmc-color-negotiable, oklch(0.78 0.14 195)) 0%,
        oklch(0.65 0.16 195) 100%
      ),
      linear-gradient(135deg,
        oklch(0.88 0.08 195) 0%,
        oklch(1 0 0) 40%,
        oklch(0.72 0.14 195) 75%,
        oklch(0.88 0.08 195) 100%
      );
    background-origin: padding-box, border-box;
    background-clip: padding-box, border-box;
    box-shadow:
      0 1px 8px oklch(0.78 0.14 195 / 0.45),
      inset 0 1px 0 oklch(1 0 0 / 0.30);
    position: relative;
    overflow: hidden;
  }
  /* Icon inset shine */
  .ptag-icon::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(180deg, oklch(1 0 0 / 0.40) 0%, transparent 55%);
    pointer-events: none;
    z-index: 1;
  }
  .ptag--sm .ptag-icon { width: 20px; height: 20px; }
  .ptag--md .ptag-icon { width: 24px; height: 24px; }
  .ptag--lg .ptag-icon { width: 30px; height: 30px; }

  /* Price text group */
  .ptag-text {
    display: inline-flex;
    align-items: baseline;
    gap: 2px;
    position: relative;
    z-index: 1;
  }
  .ptag-currency {
    font-family: var(--vmc-font-display);
    font-weight: 700;
    color: oklch(0.86 0.10 195);
    line-height: 1;
  }
  .ptag-amount {
    font-family: var(--vmc-font-display);
    font-weight: 800;
    color: oklch(1 0 0);
    font-variant-numeric: tabular-nums;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .ptag--sm .ptag-currency,
  .ptag--sm .ptag-amount { font-size: 11px; }
  .ptag--md .ptag-currency,
  .ptag--md .ptag-amount { font-size: 13px; }
  .ptag--lg .ptag-currency,
  .ptag--lg .ptag-amount { font-size: 16px; }

  /* Disabled */
  .ptag--disabled {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
    background-image:
      linear-gradient(135deg, oklch(0.52 0.03 220) 0%, oklch(0.44 0.02 220) 100%),
      linear-gradient(135deg, oklch(0.60 0.02 220) 0%, oklch(0.60 0.02 220) 100%);
    box-shadow: none;
  }
  .ptag--disabled .ptag-icon {
    background-image:
      linear-gradient(135deg, oklch(0.72 0.01 220) 0%, oklch(0.62 0.01 220) 100%),
      linear-gradient(135deg, oklch(0.80 0.01 220) 0%, oklch(0.80 0.01 220) 100%);
    box-shadow: none;
  }

  /* Skeleton */
  @keyframes ptag-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.45; }
  }
  .ptag--skeleton {
    background-image: none;
    background-color: oklch(0.82 0.02 220);
    border-color: transparent;
    box-shadow: none;
    animation: ptag-pulse 1.6s ease-in-out infinite;
    min-width: 96px;
  }
  .ptag--skeleton .ptag-icon,
  .ptag--skeleton .ptag-text { visibility: hidden; }
`;

const F = "var(--vmc-font-display, 'Plus Jakarta Sans', sans-serif)";

function HeartOutline({ size }: { size: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="var(--vmc-color-vault-600, oklch(0.38 0.20 285))"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function HeartFilled({ size }: { size: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="var(--vmc-color-vault-700, oklch(0.30 0.20 285))" stroke="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function HeartFilledWhite({ size }: { size: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="rgb(100% 100% 100% / 0.92)" stroke="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

interface LikeDemoProps { cls: string; icon: number; }

function DollarIcon({ size }: { size: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="rgb(100% 100% 100% / 0.92)" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}

interface PriceDemoProps { sizeCls: string; wrapCls: string; icon: number; }

function PriceDemo({ sizeCls, wrapCls, icon }: PriceDemoProps): JSX.Element {
  const [active, setActive] = useState(false);
  function handleToggle(): void { setActive(!active); }
  const stateCls = active ? "pprice-wrap--active" : "";
  return (
    <div className={`pprice-wrap ${wrapCls} ${stateCls}`} onClick={handleToggle}
      style={{ cursor: "pointer" }}>
      <button className={`pprice ${sizeCls}`} type="button" aria-label="Ver precio">
        <DollarIcon size={icon} />
      </button>
      <div className="pprice-shelf" />
    </div>
  );
}

function LikeDemo({ cls, icon }: LikeDemoProps): JSX.Element {
  const [liked, setLiked] = useState(false);
  function handleToggle(): void { setLiked(!liked); }
  return (
    <button
      className={`plike ${cls}${liked ? " plike--active" : ""}`}
      type="button"
      aria-label={liked ? "Quitar like" : "Me gusta"}
      onClick={handleToggle}
    >
      {liked ? <HeartFilledWhite size={icon} /> : <HeartOutline size={icon} />}
    </button>
  );
}

const USER_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

interface SectionLabelProps { title: string; subtitle?: string; dark?: boolean; }

function SectionLabel({ title, subtitle, dark }: SectionLabelProps): JSX.Element {
  return (
    <div style={{ padding: "14px 24px", borderBottom: `1px solid ${dark ? "rgb(100% 100% 100% / 0.08)" : "var(--vmc-color-vault-utility-ghost)"}` }}>
      <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.10em",
        color: dark ? "var(--vmc-color-base-inverse-muted)" : "var(--vmc-color-text-primary)", margin: 0 }}>
        {title}
      </p>
      {subtitle && (
        <p style={{ fontFamily: F, fontSize: 11,
          color: dark ? "var(--vmc-color-base-inverse-subtle)" : "var(--vmc-color-text-tertiary)", margin: "2px 0 0" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface StateColProps { label: string; children: React.ReactNode; dark?: boolean; }

function StateCol({ label, children, dark }: StateColProps): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
      <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.08em",
        color: dark ? "var(--vmc-color-base-inverse-subtle)" : "var(--vmc-color-text-tertiary)", margin: 0 }}>
        {label}
      </p>
      {children}
    </div>
  );
}




/* Shared vault gradient palette */
const VGRAD_STOPS = (
  <>
    <stop offset="0%"   stopColor="oklch(0.50 0.22 285)" />
    <stop offset="50%"  stopColor="oklch(0.32 0.20 285)" />
    <stop offset="100%" stopColor="oklch(0.18 0.16 285)" />
  </>
);

function IconVehicular({ size }: { size: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="vg-vehicular" x1="0%" y1="0%" x2="100%" y2="100%">
          {VGRAD_STOPS}
        </linearGradient>
      </defs>
      <g stroke="url(#vg-vehicular)">
        {/* Volante — 3 radios + anillo exterior + hub central */}
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.5" />
        <line x1="12" y1="3" x2="12" y2="9.5" />
        <line x1="20.2" y1="16.5" x2="14.6" y2="13.2" />
        <line x1="3.8" y1="16.5" x2="9.4" y2="13.2" />
      </g>
    </svg>
  );
}
function IconMaquinaria({ size }: { size: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="vg-maquinaria" x1="0%" y1="0%" x2="100%" y2="100%">
          {VGRAD_STOPS}
        </linearGradient>
      </defs>
      <g stroke="url(#vg-maquinaria)">
        {/* Llave inglesa — path clásico, limpio */}
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </g>
    </svg>
  );
}
function IconEquipos({ size }: { size: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="vg-equipos" x1="0%" y1="0%" x2="100%" y2="100%">
          {VGRAD_STOPS}
        </linearGradient>
      </defs>
      <g stroke="url(#vg-equipos)">
        {/* Rayo — equipos eléctricos / energía */}
        <path d="M13 2L4.5 13.5H11L10 22L20 10H13.5L13 2Z" />
      </g>
    </svg>
  );
}
function IconArticulos({ size }: { size: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="vg-articulos" x1="0%" y1="0%" x2="100%" y2="100%">
          {VGRAD_STOPS}
        </linearGradient>
      </defs>
      <g stroke="url(#vg-articulos)">
        {/* Etiqueta de precio — perfecta para artículos en subasta */}
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <circle cx="7" cy="7" r="1.5" fill="url(#vg-articulos)" stroke="none" />
      </g>
    </svg>
  );
}

interface CategoryCardDemoProps { icon: React.ReactNode; label: string; }

function CategoryCardDemo({ icon, label }: CategoryCardDemoProps): JSX.Element {
  const [pressed, setPressed] = useState(false);
  function handlePress(): void { setPressed(true); }
  function handleRelease(): void { setPressed(false); }
  const focusCls = pressed ? "pcatcard--focus" : "";
  return (
    <div
      className={`pcatcard ${focusCls}`}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      role="button"
      tabIndex={0}
      aria-label={label}
    >
      <div className="pcatcard-icon-wrap">{icon}</div>
      <span className="pcatcard-label">{label}</span>
    </div>
  );
}

interface OfferTypeDemoCardProps {
  variant: "negotiable" | "live";
  label: string;
}

function OfferTypeDemoCard({ variant, label }: OfferTypeDemoCardProps): JSX.Element {
  const [pressed, setPressed] = useState(false);
  function handlePress(): void { setPressed(true); }
  function handleRelease(): void { setPressed(false); }
  const focusCls = pressed ? "poftype--focus" : "";
  return (
    <div
      className={`poftype poftype--${variant} ${focusCls}`}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      role="button"
      tabIndex={0}
      aria-label={label}
    >
      <div className="poftype-top">
        <span className="poftype-label">{label}</span>
      </div>
      <div className="poftype-bottom">
        <span className="poftype-cta">VER TODAS</span>
      </div>
    </div>
  );
}

const CATEGORY_ITEMS = [
  { key: "vehicular",  label: "VEHICULAR",          icon: (s: number) => <IconVehicular size={s} /> },
  { key: "maquinaria", label: "MAQUINARIA",         icon: (s: number) => <IconMaquinaria size={s} /> },
  { key: "equipos",    label: "EQUIPOS DIVERSOS",   icon: (s: number) => <IconEquipos size={s} /> },
  { key: "articulos",  label: "ARTÍCULOS DIVERSOS", icon: (s: number) => <IconArticulos size={s} /> },
] as const;

export default function ButtonPrimaryPreviewPage(): JSX.Element {
  return (
    <main style={{
      background: "var(--vmc-color-background-secondary)",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      padding: "40px 0",
    }}>
      <style dangerouslySetInnerHTML={{ __html: BUTTON_CSS }} />

      <div style={{
        width: 820,
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        outline: "1px solid rgb(0% 0% 0% / 0.10)",
        boxShadow: "0 8px 32px rgb(0% 0% 0% / 0.10)",
      }}>

        {/* ── Page header ── */}
        <div style={{ background: "var(--vmc-color-background-card)", padding: "16px 24px",
          borderBottom: "1px solid var(--vmc-color-vault-utility-ghost)" }}>
          <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.10em",
            color: "var(--vmc-color-text-primary)", margin: "0 0 2px" }}>
            Button Primary
          </p>
          <p style={{ fontFamily: F, fontSize: 11, color: "var(--vmc-color-text-tertiary)", margin: 0 }}>
            Mix Cinematic + Tactile · v2.0 upgrade
          </p>
        </div>

        {/* ─────────────────────────────────────────────
            1. MD — Primary + Secondary
        ───────────────────────────────────────────── */}
        <SectionLabel title="MD · Primary & Secondary" subtitle="48px · Participa / Ingresa" />

        <div style={{ background: "var(--vmc-color-background-card)", padding: "20px 24px",
          borderBottom: "1px solid var(--vmc-color-vault-utility-ghost)" }}>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em",
              color: "var(--vmc-color-orange-500)", margin: 0 }}>
              Primary
            </p>
            <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em",
              color: "var(--vmc-color-vault-400)", margin: 0 }}>
              Secondary
            </p>
            <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em",
              color: "var(--vmc-color-orange-600)", margin: 0 }}>
              Ghost <span style={{ fontWeight: 400, opacity: 0.6 }}>· sobre live</span>
            </p>
          </div>

          {/* State rows */}
          {(["Default", "Hover", "Pressed", "Disabled"] as const).map(function renderRow(state) {
            const isHover    = state === "Hover";
            const isPressed  = state === "Pressed";
            const isDisabled = state === "Disabled";
            return (
              <div key={state} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12, marginBottom: 12, alignItems: "flex-end" }}>
                <StateCol label={state}>
                  <button
                    className={`pvbtn${isHover ? " pvbtn--hover" : ""}${isPressed ? " pvbtn--pressed" : ""}`}
                    type="button"
                    disabled={isDisabled}
                  >
                    Participa
                  </button>
                </StateCol>
                <StateCol label={state}>
                  <button
                    className={`psec${isHover ? " psec--hover" : ""}${isPressed ? " psec--pressed" : ""}`}
                    type="button"
                    disabled={isDisabled}
                  >
                    Ingresa
                  </button>
                </StateCol>
                <StateCol label={state}>
                  <div style={{ background: "var(--vmc-color-orange-500)",
                    borderRadius: 8, padding: "12px 16px", display: "inline-block" }}>
                    <button
                      className={`pghost${isHover ? " pghost--hover" : ""}${isPressed ? " pghost--pressed" : ""}`}
                      type="button"
                      disabled={isDisabled}
                    >
                      Ver ofertas
                    </button>
                  </div>
                </StateCol>
              </div>
            );
          })}
        </div>

        {/* Live demo MD */}
        <div style={{ background: "var(--vmc-color-background-card)", padding: "24px",
          display: "flex", flexDirection: "column", gap: 10,
          borderBottom: "1px solid var(--vmc-color-vault-utility-ghost)" }}>
          <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: "var(--vmc-color-text-tertiary)", margin: 0 }}>
            Demo interactivo
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "16px 0" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button className="pvbtn" type="button">Participa</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button className="psec" type="button">Ingresa</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center",
              background: "var(--vmc-color-orange-500)", borderRadius: 8, padding: "12px" }}>
              <button className="pghost" type="button">Ver ofertas relacionadas</button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            2. SM — "Ingresa" (Guest)
        ───────────────────────────────────────────── */}
        <SectionLabel title="SM · Ingresa — Guest" subtitle="40px · icono usuario · header nav" />

        <div style={{ background: "var(--vmc-color-background-card)", padding: "20px 24px",
          display: "flex", gap: 20, flexWrap: "wrap",
          borderBottom: "1px solid var(--vmc-color-vault-utility-ghost)" }}>
          <StateCol label="Default">
            <button className="pvbtn-sm" type="button">
              <span className="pvbtn-icon">{USER_ICON}</span>
              Ingresa
            </button>
          </StateCol>
          <StateCol label="Hover">
            <button className="pvbtn-sm pvbtn-sm--hover" type="button">
              <span className="pvbtn-icon">{USER_ICON}</span>
              Ingresa
            </button>
          </StateCol>
          <StateCol label="Pressed">
            <button className="pvbtn-sm pvbtn-sm--pressed" type="button">
              <span className="pvbtn-icon">{USER_ICON}</span>
              Ingresa
            </button>
          </StateCol>
        </div>

        {/* Live demo SM */}
        <div style={{ background: "var(--vmc-color-background-card)", padding: "24px",
          display: "flex", flexDirection: "column", gap: 10,
          borderBottom: "1px solid var(--vmc-color-vault-utility-ghost)" }}>
          <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: "var(--vmc-color-text-tertiary)", margin: 0 }}>
            Demo interactivo
          </p>
          <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
            <button className="pvbtn-sm" type="button">
              <span className="pvbtn-icon">{USER_ICON}</span>
              Ingresa
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            3. SM — Logged In (sobre vault)
        ───────────────────────────────────────────── */}
        <SectionLabel title="SM · Logged In — sobre header vault" dark />

        <div style={{ background: "var(--vmc-color-vault-900)", padding: "20px 24px",
          borderBottom: "1px solid rgb(100% 100% 100% / 0.08)" }}>

          {/* A / B / C — variantes oscuras */}
          <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: "rgb(100% 100% 100% / 0.30)", margin: "0 0 10px" }}>
            Oscuras / glass
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>

            <StateCol label="A — Cinematic Dark" dark>
              <button className="pvbtn-auth" type="button">
                <span className="pvbtn-auth-icon">{USER_ICON}</span>
                Bienvenido,{" "}
                <span className="pvbtn-auth-username">ZAEX5G</span>
              </button>
            </StateCol>

            <StateCol label="B — Glass" dark>
              <button className="pvbtn-auth-b" type="button">
                <span className="pvbtn-auth-b-icon">{USER_ICON}</span>
                Bienvenido,{" "}
                <span className="pvbtn-auth-b-username">ZAEX5G</span>
              </button>
            </StateCol>

            <StateCol label="C — Warm Dark" dark>
              <button className="pvbtn-auth-c" type="button">
                <span className="pvbtn-auth-c-icon">{USER_ICON}</span>
                Bienvenido,{" "}
                <span className="pvbtn-auth-c-username">ZAEX5G</span>
              </button>
            </StateCol>

          </div>

          {/* D / E / F — estilo primary (fill sólido) */}
          <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: "rgb(100% 100% 100% / 0.30)", margin: "0 0 10px" }}>
            Estilo primary (fill sólido)
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

            <StateCol label="D — Primary Clone" dark>
              <button className="pvbtn-auth-d" type="button">
                <span className="pvbtn-auth-d-icon">{USER_ICON}</span>
                Bienvenido,{" "}
                <span className="pvbtn-auth-d-username">ZAEX5G</span>
              </button>
            </StateCol>

            <StateCol label="E — Vault→Orange" dark>
              <button className="pvbtn-auth-e" type="button">
                <span className="pvbtn-auth-e-icon">{USER_ICON}</span>
                Bienvenido,{" "}
                <span className="pvbtn-auth-e-username">ZAEX5G</span>
              </button>
            </StateCol>

            <StateCol label="F — Split Bicolor" dark>
              <button className="pvbtn-auth-f" type="button">
                <span className="pvbtn-auth-f-icon">{USER_ICON}</span>
                Bienvenido,{" "}
                <span className="pvbtn-auth-f-username">ZAEX5G</span>
              </button>
            </StateCol>

          </div>
        </div>

        {/* ─────────────────────────────────────────────
            4. LikeButton
        ───────────────────────────────────────────── */}
        <SectionLabel title="LikeButton" subtitle="3 tamaños · Default / Active / Disabled / Skeleton" />

        <div style={{ background: "var(--vmc-color-background-card)", padding: "20px 24px" }}>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 1fr 1fr 1fr",
            marginBottom: 16, alignItems: "center" }}>
            <span />
            {(["Default", "Active", "Disabled", "Skeleton"] as const).map(function col(s) {
              return (
                <p key={s} style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  color: "var(--vmc-color-text-tertiary)", margin: 0, textAlign: "center" }}>
                  {s}
                </p>
              );
            })}
          </div>

          {/* Size rows */}
          {([
            { label: "Small",  cls: "plike--sm", icon: 13 },
            { label: "Medium", cls: "plike--md", icon: 19 },
            { label: "Large",  cls: "plike--lg", icon: 27 },
          ] as const).map(function sizeRow({ label, cls, icon }) {
            return (
              <div key={label} style={{ display: "grid",
                gridTemplateColumns: "72px 1fr 1fr 1fr 1fr",
                marginBottom: 20, alignItems: "center" }}>
                <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600,
                  color: "var(--vmc-color-text-secondary)", margin: 0 }}>
                  {label}
                </p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button className={`plike ${cls}`} type="button" aria-label="Me gusta">
                    <HeartOutline size={icon} />
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button className={`plike ${cls} plike--active`} type="button" aria-label="Me gusta">
                    <HeartFilledWhite size={icon} />
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button className={`plike ${cls} plike--disabled`} type="button" aria-label="Me gusta" disabled>
                    <HeartOutline size={icon} />
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button className={`plike ${cls} plike--skeleton`} type="button" aria-label="Me gusta" />
                </div>
              </div>
            );
          })}

          {/* Demo interactivo — click para toggle */}
          <div style={{ borderTop: "1px solid var(--vmc-color-vault-utility-ghost)",
            paddingTop: 16, marginTop: 4 }}>
            <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em",
              color: "var(--vmc-color-text-tertiary)", margin: "0 0 14px" }}>
              Demo interactivo — click para toggle + heart pop
            </p>
            <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center",
              padding: "16px 0" }}>
              <LikeDemo cls="plike--sm" icon={13} />
              <LikeDemo cls="plike--md" icon={19} />
              <LikeDemo cls="plike--lg" icon={27} />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            5. PriceIcon
        ───────────────────────────────────────────── */}
        <SectionLabel title="PriceIcon" subtitle="Contact shadow · Default / Disabled / Skeleton" />

        <div style={{ background: "var(--vmc-color-background-card)", padding: "20px 24px" }}>

          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 1fr 1fr",
            gap: 0, alignItems: "center", marginBottom: 4 }}>
            <span />
            {(["Default", "Disabled", "Skeleton"] as const).map(function h(s) {
              return (
                <p key={s} style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  color: "var(--vmc-color-text-tertiary)", margin: "0 0 10px",
                  textAlign: "center" }}>
                  {s}
                </p>
              );
            })}
          </div>

          {([
            { label: "Small",  sizeCls: "pprice--sm", wrapCls: "pprice-wrap--sm", icon: 13 },
            { label: "Medium", sizeCls: "pprice--md", wrapCls: "pprice-wrap--md", icon: 19 },
            { label: "Large",  sizeCls: "pprice--lg", wrapCls: "pprice-wrap--lg", icon: 27 },
          ] as const).map(function sizeRow({ label, sizeCls, wrapCls, icon }) {
            return (
              <div key={label} style={{ display: "grid",
                gridTemplateColumns: "72px 1fr 1fr 1fr",
                marginBottom: 20, alignItems: "center" }}>
                <p style={{ fontFamily: F, fontSize: 10, fontWeight: 600,
                  color: "var(--vmc-color-text-secondary)", margin: 0 }}>
                  {label}
                </p>
                {/* Default */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div className={`pprice-wrap ${wrapCls}`}>
                    <button className={`pprice ${sizeCls}`} type="button">
                      <DollarIcon size={icon} />
                    </button>
                    <div className="pprice-shelf" />
                  </div>
                </div>
                {/* Disabled — shelf invisible, mantiene posición en Y */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div className={`pprice-wrap ${wrapCls} pprice-wrap--disabled`}>
                    <button className={`pprice ${sizeCls}`} type="button" disabled>
                      <DollarIcon size={icon} />
                    </button>
                    <div className="pprice-shelf" />
                  </div>
                </div>
                {/* Skeleton — bola gris simple, sin shelf */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div className={`pprice-wrap ${wrapCls} pprice-wrap--skeleton`}>
                    <button className={`pprice ${sizeCls}`} type="button" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─────────────────────────────────────────────
            6. OfferType
        ───────────────────────────────────────────── */}
        <SectionLabel title="OfferType" subtitle="NEGOCIABLE · EN VIVO — Default / Hover / Focus" />

        <div style={{ background: "var(--vmc-color-background-card)", padding: "20px 24px" }}>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16,
            marginBottom: 20 }}>
            {(["Default", "Hover", "Focus"] as const).map(function stateHeader(s) {
              return (
                <p key={s} style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  color: "var(--vmc-color-text-tertiary)", margin: 0,
                  textAlign: "center" }}>
                  {s}
                </p>
              );
            })}
          </div>

          {/* NEGOCIABLE row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16,
            justifyItems: "center", marginBottom: 24 }}>
            {/* Default */}
            <div className="poftype poftype--negotiable">
              <div className="poftype-top">
                <span className="poftype-label">NEGOCIABLE</span>
              </div>
              <div className="poftype-bottom">
                <span className="poftype-cta">VER TODAS</span>
              </div>
            </div>
            {/* Hover */}
            <div className="poftype poftype--negotiable poftype--hover">
              <div className="poftype-top">
                <span className="poftype-label">NEGOCIABLE</span>
              </div>
              <div className="poftype-bottom">
                <span className="poftype-cta">VER TODAS</span>
              </div>
            </div>
            {/* Focus */}
            <div className="poftype poftype--negotiable poftype--focus">
              <div className="poftype-top">
                <span className="poftype-label">NEGOCIABLE</span>
              </div>
              <div className="poftype-bottom">
                <span className="poftype-cta">VER TODAS</span>
              </div>
            </div>
          </div>

          {/* EN VIVO row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16,
            justifyItems: "center" }}>
            {/* Default */}
            <div className="poftype poftype--live">
              <div className="poftype-top">
                <span className="poftype-label">EN VIVO</span>
              </div>
              <div className="poftype-bottom">
                <span className="poftype-cta">VER TODAS</span>
              </div>
            </div>
            {/* Hover */}
            <div className="poftype poftype--live poftype--hover">
              <div className="poftype-top">
                <span className="poftype-label">EN VIVO</span>
              </div>
              <div className="poftype-bottom">
                <span className="poftype-cta">VER TODAS</span>
              </div>
            </div>
            {/* Focus */}
            <div className="poftype poftype--live poftype--focus">
              <div className="poftype-top">
                <span className="poftype-label">EN VIVO</span>
              </div>
              <div className="poftype-bottom">
                <span className="poftype-cta">VER TODAS</span>
              </div>
            </div>
          </div>

          {/* Live demo */}
          <div style={{ marginTop: 24, padding: "16px 0 4px",
            borderTop: "1px solid var(--vmc-color-vault-utility-ghost)" }}>
            <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em",
              color: "var(--vmc-color-text-tertiary)", margin: "0 0 16px" }}>
              Live — hover + click
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              <OfferTypeDemoCard variant="negotiable" label="NEGOCIABLE" />
              <OfferTypeDemoCard variant="live" label="EN VIVO" />
            </div>
          </div>

        </div>

        {/* ─────────────────────────────────────────────
            7. CategoryCard
        ───────────────────────────────────────────── */}
        <SectionLabel title="CategoryCard" subtitle="93×92px · icon-wrap vault · Default / Hover / Focus" />

        <div style={{ background: "var(--vmc-color-background-card)", padding: "20px 24px" }}>

          {(() => {
            const CATS = CATEGORY_ITEMS.map(function mapCat(c) {
              return { key: c.key, label: c.label, icon: c.icon(22) };
            });

            const STATES = [
              { label: "Default", mod: ""                },
              { label: "Hover",   mod: "pcatcard--hover" },
              { label: "Focus",   mod: "pcatcard--focus" },
            ] as const;

            return (
              <>
                {STATES.map(function stateRow({ label: stateLabel, mod }) {
                  return (
                    <div key={stateLabel} style={{ marginBottom: 16 }}>
                      <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        color: "var(--vmc-color-text-tertiary)", margin: "0 0 10px" }}>
                        {stateLabel}
                      </p>
                      <div style={{ display: "flex", gap: 12 }}>
                        {CATS.map(function catCard({ key, label, icon }) {
                          return (
                            <div key={key} className={`pcatcard ${mod}`}>
                              <div className="pcatcard-icon-wrap">{icon}</div>
                              <span className="pcatcard-label">{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Live demo */}
                <div style={{ marginTop: 8, paddingTop: 16,
                  borderTop: "1px solid var(--vmc-color-vault-utility-ghost)" }}>
                  <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    color: "var(--vmc-color-text-tertiary)", margin: "0 0 12px" }}>
                    Live — hover + click
                  </p>
                  <div style={{ display: "flex", gap: 12 }}>
                    {CATS.map(function liveCard({ key, label, icon }) {
                      return (
                        <CategoryCardDemo key={key} label={label} icon={icon} />
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}

        </div>

        {/* ─────────────────────────────────────────────
            8. PriceTag
        ───────────────────────────────────────────── */}
        <SectionLabel title="PriceTag" subtitle="vault pill · icono teal + precio · SM / MD / LG" />

        <div style={{ background: "var(--vmc-color-background-card)", padding: "20px 24px" }}>

          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 1fr 1fr",
            gap: 0, alignItems: "center", marginBottom: 4 }}>
            <span />
            {(["Default", "Disabled", "Skeleton"] as const).map(function h(s) {
              return (
                <p key={s} style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  color: "var(--vmc-color-text-tertiary)", margin: "0 0 10px",
                  textAlign: "center" }}>
                  {s}
                </p>
              );
            })}
          </div>

          {([
            { label: "Small",  sizeCls: "ptag--sm", icon: 7  },
            { label: "Medium", sizeCls: "ptag--md", icon: 9  },
            { label: "Large",  sizeCls: "ptag--lg", icon: 11 },
          ] as const).map(function sizeRow({ label, sizeCls, icon }) {
            return (
              <div key={label} style={{ display: "grid",
                gridTemplateColumns: "72px 1fr 1fr 1fr",
                marginBottom: 20, alignItems: "center" }}>
                <p style={{ fontFamily: F, fontSize: 10, fontWeight: 600,
                  color: "var(--vmc-color-text-secondary)", margin: 0 }}>
                  {label}
                </p>
                {/* Default */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div className={`ptag ${sizeCls}`}>
                    <div className="ptag-icon">
                      <DollarIcon size={icon} />
                    </div>
                    <div className="ptag-text">
                      <span className="ptag-currency">US$</span>
                      <span className="ptag-amount">14,999</span>
                    </div>
                  </div>
                </div>
                {/* Disabled */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div className={`ptag ${sizeCls} ptag--disabled`}>
                    <div className="ptag-icon">
                      <DollarIcon size={icon} />
                    </div>
                    <div className="ptag-text">
                      <span className="ptag-currency">US$</span>
                      <span className="ptag-amount">14,999</span>
                    </div>
                  </div>
                </div>
                {/* Skeleton */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div className={`ptag ${sizeCls} ptag--skeleton`}>
                    <div className="ptag-icon">
                      <DollarIcon size={icon} />
                    </div>
                    <div className="ptag-text">
                      <span className="ptag-currency">US$</span>
                      <span className="ptag-amount">14,999</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        {/* ─────────────────────────────────────────────
            9. QuickFilter
        ───────────────────────────────────────────── */}
        <SectionLabel
          title="QuickFilter"
          subtitle="766×180px · OfferType + CategoryCard · composición real"
        />

        <div style={{ background: "var(--vmc-color-background-card)", padding: "20px 24px" }}>

          {/* Static — default state */}
          <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: "var(--vmc-color-text-tertiary)", margin: "0 0 12px" }}>
            Default
          </p>
          <div className="pqf">
            <div className="pqf-section pqf-section--offer">
              <div className="pqf-heading">
                <span className="pqf-heading-text">Tipo de Oferta</span>
              </div>
              <div className="pqf-items">
                <div className="poftype poftype--live">
                  <div className="poftype-top">
                    <span className="poftype-label">EN VIVO</span>
                  </div>
                  <div className="poftype-bottom">
                    <span className="poftype-cta">VER TODAS</span>
                  </div>
                </div>
                <div className="poftype poftype--negotiable">
                  <div className="poftype-top">
                    <span className="poftype-label">NEGOCIABLE</span>
                  </div>
                  <div className="poftype-bottom">
                    <span className="poftype-cta">VER TODAS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pqf-section pqf-section--cats">
              <div className="pqf-heading">
                <span className="pqf-heading-text">Categorías</span>
              </div>
              <div className="pqf-items">
                {CATEGORY_ITEMS.map(function qfCatCard(c) {
                  return (
                    <div key={c.key} className="pcatcard">
                      <div className="pcatcard-icon-wrap">{c.icon(20)}</div>
                      <span className="pcatcard-label">{c.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live — interactive */}
          <div style={{ marginTop: 24, paddingTop: 20,
            borderTop: "1px solid var(--vmc-color-vault-utility-ghost)" }}>
            <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em",
              color: "var(--vmc-color-text-tertiary)", margin: "0 0 12px" }}>
              Live — hover + click en cada componente
            </p>
            <div className="pqf">
              <div className="pqf-section pqf-section--offer">
                <div className="pqf-heading">
                  <span className="pqf-heading-text">Tipo de Oferta</span>
                </div>
                <div className="pqf-items">
                  <OfferTypeDemoCard variant="live" label="EN VIVO" />
                  <OfferTypeDemoCard variant="negotiable" label="NEGOCIABLE" />
                </div>
              </div>

              <div className="pqf-section pqf-section--cats">
                <div className="pqf-heading">
                  <span className="pqf-heading-text">Categorías</span>
                </div>
                <div className="pqf-items">
                  {CATEGORY_ITEMS.map(function qfCatLive(c) {
                    return (
                      <CategoryCardDemo key={c.key} label={c.label} icon={c.icon(20)} />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
