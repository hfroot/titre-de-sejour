const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('response', response => {
    if(response.status() >= 400) {
      console.log("OH NO", response.status(), response.url())
      throw new Error("Lets take a break")
    }
  });
  let response;

  const desks = ["990", "1000", "1001", "1002", "1003", "1005", "1028", "1029"];
  
  for(let idx=0; idx<desks.length; idx++) {
    await page.goto('https://pprdv.interieur.gouv.fr/booking/create/989');

    await page.check('input[name="condition"]');
    await page.click('text=Effectuer une demande de rendez-vous');

    await page.check(`input[name="planning"][value="${desks[idx]}"]`);
    await page.click('text=Etape suivante');

    const formElement = await page.$('#FormBookingCreate');
    const formText = await formElement.innerText();

    if(formText.includes("Il n'existe plus de plage horaire")) {
      console.log("yep, nothing still")
    } else {
      // Notify me immediately with desk[idx]
    }
    await page.screenshot({ path: `example.png` });
  }
  // TODO: tweet that the program has run, with X unsuccessful
  // ---------------------
  await context.close();
  await browser.close();
})();
