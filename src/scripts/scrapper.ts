import axios from "../../node_modules/axios/index";
import { profileSelectors, urls } from "../config/scrapper.config";

import { getCookie } from "../utils/cookie";
import { parseDate } from "../utils/dates";
import { $, $$, $Anch } from "../utils/selectors";
import { waitForScroll } from "../utils/waitFor";
import dayjs from "dayjs";

class Scrap {
  // Se conecta con una api de Linkedin para obtener información de contacto
  profile: object;
  async getContactInfo() {
    const [contactInfoName] =
      $Anch("#top-card-text-details-contact-info").href.match(/in\/.+\/o/g) ??
      [];
    const token = getCookie("JSESSIONID", document.cookie);

    const apiUrl =
      urls.baseUrl + urls.api + urls.urlContactInfo(contactInfoName);

    const {
      data: { data },
    } = await axios.get(apiUrl, {
      headers: {
        accept: "application/vnd.linkedin.normalized+json+2.1",
        "csrf-token": token,
      },
    });
    return data;
  }

  // Obtiene la experiencia del candidato SIN TERMINAR solo obtiene Títulos

  async getExperience() {
    const experience = [];
    $$("#experience ~ .pvs-list__outer-container > ul > li").map(
      (e: HTMLElement) => {
        experience.push($("span[aria-hidden]", e).textContent);
      }
    );

    return experience;
  }

  // Obtiene la educación del candidato SIN TERMINAR solo obtiene los títulos

  async getEducation() {
    const education = [];
    $$("#education ~ .pvs-list__outer-container > ul > li").map(
      (e: HTMLElement) => {
        education.push($("span[aria-hidden]", e).innerText.trim());
      }
    );
    return education;
  }

  getAllInfo(selector: string) {
    try {
      const Elements = $$(selector);

      return Elements.map((listItem: HTMLElement) => {
        if (!$(".pvs-entity__path-node", listItem)) {
          const [title, enterprise, dateStringInfo] = $$(
            "span[aria-hidden]",
            listItem
          ).map((element) => element.textContent);

          const [parsedRawDate] =
            dateStringInfo.match(/.+·|\d{4} - \d{4}/) ?? [];

          const [startDate, endDate] = (
            parsedRawDate?.replace(/\s|·/g, "").split("-") ?? []
          ).map((rawDateElement) => parseDate(rawDateElement));

          return { title, enterprise, startDate, endDate };
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("🚀scrapper.js ~ line 51 ~ getEspecificInfo ~ error", error);
    }
  }

  async getVisibleData() {
    const experiences = this.getAllInfo(profileSelectors.experiencesElements);
    const educations = this.getAllInfo(profileSelectors.educationElements);
    return {
      experiences,
      educations,
    };
  }

  // Obtención del nombre del candidato.

  async getName() {
    return $("h1").textContent;
  }

  // Inicialización del scrapping

  async scrap() {
    await waitForScroll(100, 100);

    const [name, contactInfo, visibleData] = await Promise.all([
      this.getName(),
      this.getContactInfo(),
      this.getVisibleData(),
    ]);

    this.profile = {
      name,
      contactInfo,
      ...visibleData,
    };

    this.fetchData(this.profile);
  }

  async fetchData(data: any) {
    await fetch("http://localhost:3000/user", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

const scrap = new Scrap();

scrap.scrap();
