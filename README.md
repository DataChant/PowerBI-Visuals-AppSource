# PowerBI-Visuals-Marketplace
Welcome to the PowerBI-Visuals-Marketplace repository! This is a repository of Power BI custom visuals that are exported daily from Microsoft Marketplace (formerly known as AppSource) to support the Power BI community. The repository includes pbiviz files, sample report (pbix) files, thumbnails, and automations.

(Starting from Mar 3rd, 2026 this repository is refreshed daily and not weekly).

The **[Custom Visuals Marketplace](https://datachant.github.io/PowerBI-Visuals-Marketplace/)** website ranks every Power BI custom visual listed on Microsoft Marketplace by popularity, and replays day by day how the rankings changed. The website is rebuilt after every daily refresh, and nobody needs to sign in to use it. It is built with [Rayfin](https://learn.microsoft.com/en-us/javascript/api/fabric-apps-sdk-javascript/rayfin-overview), and its source is in the [app](app) folder, which also explains how to publish a copy as a Fabric app.

A video tour of the website, 1 minute and 23 seconds long, is on [YouTube](https://youtu.be/ABocSzcHIGg).

[![The Custom Visuals Marketplace video tour on YouTube](https://img.youtube.com/vi/ABocSzcHIGg/maxresdefault.jpg)](https://youtu.be/ABocSzcHIGg)

Learn more in our Wiki [here](https://github.com/DataChant/PowerBI-Visuals-Marketplace/wiki).

Have questions regarding this repository? Contact DataChant [here](https://forms.office.com/r/xZMuiaSdYh?origin=lprLink).

For a full list of all the custom visuals in this repository, their publishers, legal terms, privacy agreements, support links and more go [here](https://github.com/DataChant/PowerBI-Visuals-Marketplace/blob/main/Visuals%20Summary.md).

# FAQ
## General questions

Q: What is the source of the files in this repository?

> A: The single source of truth for all of the Power BI Custom Visuals in this repository is [Microsoft Marketplace](https://marketplace.microsoft.com/en-us/marketplace/apps?product=power-bi-visuals). All the files in this repository are periodically imported using a Microsoft public API (which is available to Microsoft partners).

Q: Are the custom visuals here up to date?

> A: We refresh this repository daily, and [announce](https://github.com/DataChant/PowerBI-Visuals-Marketplace/discussions/categories/announcements) what’s new with Power BI visuals on Microsoft Marketplace by finding the difference between commits. To make sure you have the latest version of a specific visual, you can download it from [Microsoft Marketplace](https://marketplace.microsoft.com/en-us/marketplace/apps?product=power-bi-visuals) and compare its version with this repository. To have a bulk downloader automation with the current snapshot from Microsoft Marketplace (and not rely on this repository for its daily refresh) you can download our Excel Macro-enabled file. Learn more about it [here](https://datachant.com/2024/01/21/power-bi-custom-visuals-downloads/). [Contact us](https://forms.office.com/r/xZMuiaSdYh?origin=lprLink) if you have any questions about the tool or need help in automating your exports of custom visuals from Microsoft Marketplace.

## Questions by Power BI developers
### I am a Power BI developer with a Power BI Pro license

Q: What are the benefits of downloading the PBIVIZ files from this repository and not from Power BI Desktop or Microsoft Marketplace?

> A: To get the latest version of a custom visual, we recommend that you download the visual directly from Microsoft. However, if you cannot access the visuals, need to get an older version or a visual that is no longer available on Microsoft Marketplace, you may find it in this repository. Note: If you choose to use the files from this repository in your Power BI reports, please make sure you follow Microsoft [terms of use](https://learn.microsoft.com/en-us/legal/marketplace/marketplace-terms) and the ones shared by the publisher.

Q: Can I find in this repository older pbiviz files that are no longer available by Microsoft?

> A: Yes. You will find all versions of the visuals since January 2024 under **PBIVIZ with versions** subfolder that is under **All Listed**, **All Visuals**, **Certified**, and **Uncertified** folders. In addition, if the visuals are no longer on Microsoft Marketplace, you will find their last version under the **Unlisted** [folder](https://github.com/DataChant/PowerBI-Visuals-Marketplace/tree/main/Unlisted).

Q: What is the difference between the visual files in **PBIVIZ** and the ones in **PBIVIZ with versions** subfolder?
> A: The same visuals exist in both subfolders. However, in PBIVIZ subfolder, we store the latest version of each visual in a user-friendly filename. In PBIVIZ with versions, each visual may have multiple files with the versions in the filename suffix.

Q: What is the difference between **PBIVIZ** and **PBIVIZ with guid** subfolders?
> A: The same visuals exist in both subfolders but with different filenames. In PBIVIZ subfolder, we store the visuals in user-friendly filenames. In PBIVIZ with guid, we store the visuals with their official visual GUIDs as they are found in Power BI reports and extracted project files. The GUIDs will help you match visuals in your reports with the ones in this repository.

Q: How can I learn more about custom visuals that I found in this repository? 

> A: You can learn more about all the custom visuals on Microsoft Marketplace and contact the publishers. For a broader analysis of all custom visuals, you can install our Custom Visuals Exploration Tool [here](https://marketplace.microsoft.com/en-us/product/power-bi/datachant-5311696.powerbi_customvisuals?tab=Overview). Learn more about it [here](https://datachant.com/custom-visuals-app/).

![](https://i0.wp.com/datachant.com/wp-content/uploads/2023/09/image-8.png?resize=1536%2C891&ssl=1)

### I am a Power BI developer without a Power BI account

Q: I cannot download custom visuals from Microsoft Marketplace without logging in to a Microsoft account, can I use the PBIVIZ files in this repository to develop Power BI reports with custom visuals in Power BI Desktop?

> A: We recommend that you consult with your IT team before you use the files in this repository. Make sure you follow the terms of use in Power BI Desktop and agree to the license in this repository.

## Questions by Power BI administrators
Q: I am setting up Power BI Organizational Visuals. What are the benefits of using this repository?

> A: While you can import custom visuals directly from Microsoft Marketplace to define your Organizational Visuals, you can use this repository if you need to control the versions your users can use. In addition, this repository can help you audit a bulk of custom visuals (e.g. using a security scan of all the files) before you share them in your organization. You can learn more about Organizational Visuals [here](https://learn.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-faq#organizational-visuals).

## Questions by publishers
### I am a publisher of a custom visual that is available on Microsoft Marketplace

Q: Can I join as a contributor to share updates regarding my custom visuals?

> A: Yes. Contact us using the form above.

Q: Can I move my custom visuals from this repository?

> A: Yes. Contact us using the form above.

### I am a publisher of a custom visual that is not available on Microsoft Marketplace

Q: Can I publish my custom visuals in this repository?
>A: Not at this stage. Only published custom visuals are shared in this repository for the benefit of the Power BI Community.


