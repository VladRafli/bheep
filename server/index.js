const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

/**
 * Check Forum on Binusmaya
 * 
 * Work only for Student from Binus Malang who Mobility to Jakarta
 * 
 * Not Handled Yet:
 * 1. If Binusmaya Maintenance
 * 2. If Popup shown late and there is no retry to close the popup
 */
(async () => {
    // Open Browser
    let driver = new Builder()
        .forBrowser('chrome')
        .build();
    
    // Binusmaya Index Page
    await driver.get('https://binusmaya.binus.ac.id');

    /**
     * Need help from anybody to save the page when Bimay is Maintenance
     * Need to inspect the element at that time
     */

    // Click login button
    await driver.findElement(By.css('.logo-binusmaya > .button')).click();

    /**
     * Login Microsoft
     * 
     * 1. Insert Email
     * 2. Insert Password
     * 3. Stay Signed In Confirmation
     */

    // Email
    await driver.findElement(By.css('.placeholderContainer > .form-control[type=\"email\"]')).sendKeys('rafli.jaskandi@binus.ac.id', Key.ENTER);

    // Password
    await driver.findElement(By.css('.placeholderContainer > .form-control[name=\"passwd\"]')).sendKeys('Raeflyaj12', Key.ENTER);

    // Stay Signed In Confirmation
    await driver.findElement(By.css('.inline-block > .button_primary')).click();

    /**
     * Binusmaya Student Page
     * 
     * 1. Close any pop-ups
     * 2. Open Navigation
     * 3. Click Forum button
     * IF Student = Not Mobility
     *     ...
     * ELSE
     *     4. Select Institution to BINUS University
     *     5. List Course available and store to an Array
     *     FOR EACH Courses
     *         6. Select Course
     *         7. Select Topic to All/Other
     *         8. Get all Forum links and store to an Array
     *         FOR EACH Forum
     *             9. Open New Tab For Each Forum Exist
     */

    // 1. Close pop-ups
    while (true) {
        let fail = false;
        await driver.wait(until.elementIsVisible(By.css('#popupButton > .button-primary')), 2000).catch(() => {
            fail = true
        });
        if (!fail) {
            await driver.findElement(By.css('#popupButton > .button-primary')).click();
        } else {
            console.log('There should be no popup shown');
            break;
        }
    }

    // 2. Open Navigation
    await driver.findElement(By.css('#main-nav-expand')).click();

    // 3. Click Forum Button
    await driver.findElement(By.css('#mCSB_1 li a[title=\"Forum\"]')).click();

    // 4. Select Institution to Binus University
    // await driver.findElement(By.css('#ddlInstitution'))

    // await driver.findElement(selenium.By.xpath('//'))
})()
.then(() => {
    console.log('Script run sucessfully');
})
.catch(e => {
    console.log(e);
})