import { type Component, type JSX } from 'solid-js';
// image
import Kyle from '@public/kyle/kyle-bg.webp';
import Linkedin from '@public/linkedin-icon.png';
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
                  <h3 class="profile-item__title">Kronon Labs Inc.</h3>
                  <span class="profile-item__period">Apr 2025 — Present</span>
                </div>
                <p class="profile-item__role">Quant Developer</p>
                <p class="profile-item__desc">
                  Trading Strategy Implementation
                </p>
                <span class="profile-item__duration">Current</span>
              </div>

              <div class="profile-item profile-item--experience">
                <div class="profile-item__header">
                  <h3 class="profile-item__title">Medium Inc.</h3>
                  <span class="profile-item__period">Sep 2022 — Feb 2024</span>
                </div>
                <p class="profile-item__role">Core Team · Manager (2nd Year)</p>
                <p class="profile-item__desc">Blockchain Development</p>
                <span class="profile-item__duration">18 months</span>
              </div>

              <div class="profile-item profile-item--experience">
                <div class="profile-item__header">
                  <h3 class="profile-item__title">BF Labs Inc.</h3>
                  <span class="profile-item__period">Aug 2022 — Sep 2022</span>
                </div>
                <p class="profile-item__role">
                  Development Team · Staff (1st Year)
                </p>
                <p class="profile-item__desc">Blockchain Development</p>
                <span class="profile-item__duration">2 months</span>
              </div>
            </div>
          </section>

          {/* Documents Section */}
          <section class="profile-section">
            <h2 class="profile-section__title">Documents</h2>
            <div class="profile-section__content">
              <p class="profile-section__note">
                📌 For the most up-to-date resume, please check my Wanted
                profile.
              </p>
              <div class="profile-links">
                <a
                  href="https://kyle-park.notion.site/CV-10c5e2b1051680319fe4f8e1713993b4"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="profile-link"
                >
                  <span class="profile-link__icon">📋</span>
                  <span class="profile-link__text">
                    <span class="profile-link__label">CV / Resume</span>
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
                    <span class="profile-link__label">Cover Letter</span>
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
                    Air Conditioning & Refrigeration Engineer
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
                    General Machinery Engineer
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
