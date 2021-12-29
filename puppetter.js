const puppeteer = require('puppeteer');

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
    const browser = await puppeteer.launch({ 
        headless: false
    });
    const page = await browser.newPage();
    // Binusmaya Index Page
    await page.goto('https://binusmaya.binus.ac.id/');
    // If Binusmaya is maintenance
    /**
     * Need help from anybody to save the page when Bimay is Maintenance
     * Need to inspect the element at that time
     */
    /* if (await page.evaluate(() => {

    })) */
    await page.waitForSelector('.logo-binusmaya > .button');
    await page.click('.logo-binusmaya > .button');
    /**
     * Login Microsoft
     * 
     * 1. Insert Email
     * 2. Insert Password
     * 3. Stay Signed In Confirmation
     */

    // Insert Email
    await page.waitForSelector('.placeholderContainer > .form-control[type=\"email\"]');
    await page.type('.placeholderContainer > .form-control[type=\"email\"]', 'rafli.jaskandi@binus.ac.id');
    await page.click('.inline-block > .button_primary');

    // Insert Password
    await page.waitForSelector('.placeholderContainer > .form-control[name=\"passwd\"]');
    await page.type('.placeholderContainer > .form-control[name=\"passwd\"]', 'Raeflyaj12');
    await page.click('.inline-block > .button_primary');

    // Stay Signed In Confirmation
    await page.waitForSelector('.inline-block > .button_primary');
    await page.click('.inline-block > .button_primary');

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
        await page.waitForSelector('#popupButton > .button-primary')
            .catch(() => {
                fail = true;
            });
        if (!fail) {
            await page.click('#popupButton > .button-primary');
        } else {
            console.log('There should be no popup shown');
            break;
        }
    }

    // 2. Open Navigation
    await page.click('#main-nav-expand');

    // 3. Click Forum Button
    await page.click('#mCSB_1 li a[title=\"Forum\"]');

    // 4. Select Institution to Binus University
    await page.waitForSelector('#ddlInstitution');
    await page.select('#ddlInstitution', 'BNS01');

    // 5. List Course available and store to an Array
    let courses = await page.evaluate(() => {
        let values = [];

        document.querySelectorAll('#ddlCourse > option').forEach(el => {
            values.push({
                courseCode: el.innerHTML.split(' - ')[0],
                courseName: el.innerHTML.split(' - ')[1],
                courseValue: el.value
            });
        });

        return values;
    });

    // Debug Courses Array Value
    console.log(courses);

    // Setup Courses Object to store Forum Links based on their Course Categories
    let forum = {};
    for (let i = 0; i < courses.length; i++) {
        forum[`${courses[i].courseCode}`] = [];
    }

    // FOR EACH Courses
    /**
     * There still some bug on pushing new value in array of forum Object
     */
    courses.forEach(async courseArray => {
        // 6. Select Course
        await page.select('#ddlCourse', courseArray.courseValue);
        // 7. Select Topic to All/Other
        /**
         * Can't Select Option with no value on it
         * await page.select('#ddlTopic', '');
         * 
         * Solution:
         * 1. Get all option value
         * 2. Select each option
         * 3. Get any forum that available each topic
         */
        await page.waitForSelector('#ddlTopic > option[value=\"\"]');
        await page.evaluate(async () => {
            document.querySelectorAll('#ddlTopic > option').forEach(async (topic, index) => {
                forum[`${courseArray.courseCode}`].push({
                    courseTopic: topic.innerHTML,
                    courseValue: topic.value,
                    courseForum: []
                });

                // 8. Get all Forum links and store to an Array
                /* await page.waitForSelector('.ctitle');
                document.querySelectorAll('.ctitle > a').forEach(forumPost => {
                    forum[`${courseArray.courseName}`][index].courseForum.push({
                        forumTitle: forumPost.innerHTML,
                        forumLink: forumPost.href
                    })
                }) */
            })
        })
        
        /* await page.evaluate(() => {
            document.querySelectorAll('.ctitle > a').forEach(forum => {
                forum[`${courseArray.courseName}`].push({
                    forumTitle: forum.innerHTML,
                    forumLink: forum.href
                });
            });
        }); */
    });

    // Debug Forum Links Array Value
    console.log(forum);

})()
.then(() => {
    console.log('Script run successfully!');
})
.catch(e => {
    console.log('Something wrong on executing the bot, check again the script...');
    console.log(e);
});