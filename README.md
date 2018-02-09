# mealplan-sheets

We use a Google Sheet to plan dinners for the week like in the screenshot below (data removed). This repo holds a script for scraping the table and creating all day calendar events on a shared calendar with the title of the meal.

Google Apps Scripts have strange conventions, and must contain a `Code.gs` file, which is why `Code.js` is named as such. When [clasp](https://developers.google.com/apps-script/guides/clasp) deploys this it validates the Javascript (must be ES5) and renames the file extension.

---

Deploy with [clasp](https://developers.google.com/apps-script/guides/clasp)

```bash
$ clasp push
$ clasp version "Some description"
# A version number is output here, reference that for the deploy command.
$ clasp deploy <version> "Some deploy description"
```

---

![Google Sheet table screenshot](https://i.imgur.com/PA0EzBC.png)
