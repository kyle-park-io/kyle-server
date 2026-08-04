import { type Component, type JSX } from 'solid-js';
// image
import Kyle from '@public/kyle/kyle-bg.webp';
import Linkedin from '@public/linkedin-icon.png';
import XIcon from '@public/x-icon.svg';
import MantleIcon from '@public/mantle-icon.png';
import KhuIcon from '@public/khu-icon.png';
import QuantIcon from '@public/quant-icon.svg';
// styles
import './Profile.css';

/**
 * Profile Page Component
 * New York Times inspired elegant profile/resume design
 * Clean typography with professional layout
 */
const Profile: Component = (): JSX.Element => {
  return (
    <div class="profile-page">
      <div class="profile-container">
        {/* Profile Header with Photo */}
        <header class="profile-header">
          <div class="profile-header__photo-wrapper">
            <img src={Kyle} alt="Kyle Park" class="profile-header__photo" />
          </div>
          <div class="profile-header__info">
            <h1 class="profile-header__name">Kyle Park</h1>
            <p class="profile-header__title">
              Blockchain · Quant · Software Engineer
            </p>
            <div class="profile-header__badges">
              <span class="profile-header__mbti">ENTJ</span>
              <a
                href="https://www.linkedin.com/in/kyle-park-io"
                target="_blank"
                rel="noopener noreferrer"
                class="profile-header__social-link"
              >
                <img
                  src={Linkedin}
                  alt="LinkedIn"
                  class="profile-header__social-icon"
                />
              </a>
              <a
                href="https://x.com/bcd_kyle"
                target="_blank"
                rel="noopener noreferrer"
                class="profile-header__social-link"
                title="X — @bcd_kyle"
              >
                <img src={XIcon} alt="X" class="profile-header__social-icon" />
              </a>
              <a
                href="https://kyle-quant.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                class="profile-header__social-link"
                title="Quant Portfolio"
              >
                <img
                  src={QuantIcon}
                  alt="Quant Portfolio"
                  class="profile-header__social-icon"
                />
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div class="profile-content">
          {/* Education Section */}
          <section class="profile-section">
            <h2 class="profile-section__title">Education</h2>
            <div class="profile-section__content">
              <div class="profile-item profile-item--education">
                <img
                  src={KhuIcon}
                  alt="Kyung Hee University"
                  class="profile-item__icon"
                />
                <div class="profile-item__info">
                  <h3 class="profile-item__title">Kyung Hee University</h3>
                  <p class="profile-item__subtitle">
                    Bachelor of Engineering in Mechanical Engineering
                  </p>
                  <p class="profile-item__subtitle">Mar 2014 — Aug 2022</p>
                </div>
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section class="profile-section">
            <h2 class="profile-section__title">Experience</h2>
            <div class="profile-section__content">
              <div class="profile-item profile-item--experience">
                <div class="profile-item__header">
                  <h3 class="profile-item__title">Mantle Network</h3>
                  <span class="profile-item__period">Apr 2026 — Present</span>
                </div>
                <p class="profile-item__role">Developer Relations Engineer</p>
                <p class="profile-item__desc">
                  Korean market developer outreach. Built the Korea team's
                  content operations pipeline, authored the Korean technical
                  documentation set, and ran the builder funnel for The Turing
                  Test Hackathon 2026 and a seven-university campus tour.
                </p>
                <a href="/devrel" class="profile-item__link">
                  See the DevRel work →
                </a>
                <span class="profile-item__duration">Current</span>
              </div>

              <div class="profile-item profile-item--experience">
                <div class="profile-item__header">
                  <h3 class="profile-item__title">Kronon Labs Inc.</h3>
                  <span class="profile-item__period">Apr 2025 — Nov 2025</span>
                </div>
                <p class="profile-item__role">
                  Trading System Backend Engineer
                </p>
                <p class="profile-item__desc">
                  Trading Strategy Implementation
                </p>
                <span class="profile-item__duration">8 months</span>
              </div>

              <div class="profile-item profile-item--experience">
                <div class="profile-item__header">
                  <h3 class="profile-item__title">Orakle</h3>
                  <span class="profile-item__period">Mar 2025 — Present</span>
                </div>
                <p class="profile-item__role">
                  Vice President (8th Cohort, Mar 2026 — Present) · Team Leader,
                  ODA Team (7th Cohort, Sep 2025 — Feb 2026)
                </p>
                <p class="profile-item__desc">
                  KAIST-based blockchain research society. Sole author of the
                  7th cohort's five published DeFi research papers (CC BY 4.0),
                  covering a stablecoin depeg survey across CEX and on-chain
                  venues, Solana searcher/solver strategy design, and a
                  17-category DeFi ecosystem taxonomy.
                </p>
                <a
                  href="https://github.com/orakle-7th-sda/conference-pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="profile-item__link"
                >
                  Read the papers →
                </a>
                <span class="profile-item__duration">Current</span>
              </div>

              <div class="profile-item profile-item--experience">
                <div class="profile-item__header">
                  <h3 class="profile-item__title">Medium Inc.</h3>
                  <span class="profile-item__period">Sep 2022 — Feb 2024</span>
                </div>
                <p class="profile-item__role">
                  Core Team · Backend Developer (2nd Year)
                </p>
                <p class="profile-item__desc">Blockchain Development</p>
                <span class="profile-item__duration">18 months</span>
              </div>

              <div class="profile-item profile-item--experience">
                <div class="profile-item__header">
                  <h3 class="profile-item__title">BF Labs Inc.</h3>
                  <span class="profile-item__period">Aug 2022 — Sep 2022</span>
                </div>
                <p class="profile-item__role">
                  Development Team · Backend Developer (1st Year)
                </p>
                <p class="profile-item__desc">Blockchain Development</p>
                <span class="profile-item__duration">2 months</span>
              </div>
            </div>
          </section>

          {/* Awards Section */}
          <section class="profile-section">
            <h2 class="profile-section__title">Awards</h2>
            <div class="profile-section__content">
              <div class="profile-item profile-item--experience">
                <div class="profile-item__header">
                  <h3 class="profile-item__title">
                    🏆 1st Place — Mantle Global Hackathon 2025
                  </h3>
                  <span class="profile-item__period">Feb 2026</span>
                </div>
                <p class="profile-item__role">
                  DeFi &amp; Composabilities Track Winner
                </p>
                <p class="profile-item__desc">
                  DOOR Protocol — a Decentralized Offered Rate protocol for
                  fixed income
                </p>
              </div>

              <div class="profile-item profile-item--experience">
                <div class="profile-item__header">
                  <h3 class="profile-item__title">
                    🥉 3rd Place — Seoulana Hackathon 2025
                  </h3>
                  <span class="profile-item__period">Apr 2025</span>
                </div>
                <p class="profile-item__role">
                  Solana blockchain development competition
                </p>
              </div>
            </div>
          </section>

          {/* Documents Section */}
          <section class="profile-section">
            <h2 class="profile-section__title">Documents</h2>
            <div class="profile-section__content">
              <p class="profile-section__note">
                📌 You can also check my resume on Wanted profile.
              </p>
              <div class="profile-links">
                <a
                  href="/cv/jungho_park_cv_latest.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="profile-link"
                >
                  <span class="profile-link__icon">📋</span>
                  <span class="profile-link__text">
                    <span class="profile-link__label">CV / Resume</span>
                    <span class="profile-link__desc">
                      Professional resume and career history
                    </span>
                  </span>
                  <span class="profile-link__arrow">→</span>
                </a>

                <a
                  href="https://kyle-park.notion.site/CV-10c5e2b1051680319fe4f8e1713993b4"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="profile-link"
                >
                  <span class="profile-link__icon">📄</span>
                  <span class="profile-link__text">
                    <span class="profile-link__label">
                      CV / Resume (Archived)
                    </span>
                    <span class="profile-link__desc">
                      Career history and skills
                    </span>
                  </span>
                  <span class="profile-link__arrow">→</span>
                </a>

                <a
                  href="https://kyle-park.notion.site/Cover-Letter-f3ea582e4db84ad3b256b4f153349d02"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="profile-link"
                >
                  <span class="profile-link__icon">✉️</span>
                  <span class="profile-link__text">
                    <span class="profile-link__label">
                      Cover Letter (Archived)
                    </span>
                    <span class="profile-link__desc">
                      Personal introduction
                    </span>
                  </span>
                  <span class="profile-link__arrow">→</span>
                </a>
              </div>
            </div>
          </section>

          {/* Portfolio Section */}
          <section class="profile-section">
            <h2 class="profile-section__title">Portfolio</h2>
            <div class="profile-section__content">
              <div class="profile-links">
                <a
                  href="https://kyle-quant.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="profile-link profile-link--highlight"
                >
                  <img
                    src={QuantIcon}
                    alt="Quant"
                    class="profile-link__icon-img profile-link__icon-img--invert"
                  />
                  <span class="profile-link__text">
                    <span class="profile-link__label">Quant Portfolio</span>
                    <span class="profile-link__desc">
                      Trading strategies and quantitative analysis
                    </span>
                  </span>
                  <span class="profile-link__arrow">→</span>
                </a>

                <a href="/devrel" class="profile-link">
                  <img
                    src={MantleIcon}
                    alt="Mantle"
                    class="profile-link__icon-img"
                  />
                  <span class="profile-link__text">
                    <span class="profile-link__label">DevRel</span>
                    <span class="profile-link__desc">
                      Developer relations work at Mantle Network
                    </span>
                  </span>
                  <span class="profile-link__arrow">→</span>
                </a>

                <a
                  href="https://kyle-park.notion.site/HI-I-m-KYLE-c52ac7c7e75c41dd92792f9db8cee895"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="profile-link"
                >
                  <span class="profile-link__icon">📊</span>
                  <span class="profile-link__text">
                    <span class="profile-link__label">Dashboard</span>
                    <span class="profile-link__desc">
                      Overview of all works
                    </span>
                  </span>
                  <span class="profile-link__arrow">→</span>
                </a>

                <a
                  href="https://kyle-park.notion.site/Portfolio-a69711e7a8484ec08821c84199900e37"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="profile-link"
                >
                  <span class="profile-link__icon">💻</span>
                  <span class="profile-link__text">
                    <span class="profile-link__label">Personal Projects</span>
                    <span class="profile-link__desc">
                      Side projects and experiments
                    </span>
                  </span>
                  <span class="profile-link__arrow">→</span>
                </a>

                <a
                  href="https://kyle-park.notion.site/Technical-Document-c92ee6d25f1f48fe8fa54ef5fa79790c"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="profile-link"
                >
                  <span class="profile-link__icon">📚</span>
                  <span class="profile-link__text">
                    <span class="profile-link__label">Technical Documents</span>
                    <span class="profile-link__desc">
                      In-depth technical writings
                    </span>
                  </span>
                  <span class="profile-link__arrow">→</span>
                </a>
              </div>
            </div>
          </section>

          {/* Certifications Section */}
          <section class="profile-section">
            <h2 class="profile-section__title">Certifications</h2>
            <div class="profile-section__content">
              <div class="profile-certs">
                <div class="profile-cert">
                  <span class="profile-cert__year">2021</span>
                  <span class="profile-cert__name">
                    Engineer Air-Conditioning Refrigerating Machinery
                  </span>
                </div>
                <div class="profile-cert">
                  <span class="profile-cert__year">2021</span>
                  <span class="profile-cert__name">
                    TOEIC Speaking — 150 (Intermediate High)
                  </span>
                </div>
                <div class="profile-cert">
                  <span class="profile-cert__year">2020</span>
                  <span class="profile-cert__name">
                    Engineer General Machinery
                  </span>
                </div>
                <div class="profile-cert">
                  <span class="profile-cert__year">2019</span>
                  <span class="profile-cert__name">
                    Computer Literacy Level 1
                  </span>
                </div>
                <div class="profile-cert">
                  <span class="profile-cert__year">2015</span>
                  <span class="profile-cert__name">
                    Driver's License (Class 1)
                  </span>
                </div>
                <div class="profile-cert">
                  <span class="profile-cert__year">2005</span>
                  <span class="profile-cert__name">Word Processor Level 1</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
