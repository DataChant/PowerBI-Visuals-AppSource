# PowerBI-Visuals-AppSource
Welcome to the PowerBI-Visuals-AppSource wiki! This is a repository of Power BI custom visuals that are periodically exported from Microsoft AppSource to support the Power BI community. The repository includes pbiviz files, sample report (pbix) files, thumbnails, and automation.

Learn more in our Wiki [here](https://github.com/DataChant/PowerBI-Visuals-AppSource/wiki).

Have questions regarding this repository? Contact DataChant [here](https://forms.office.com/r/xZMuiaSdYh?origin=lprLink).

For a full list of all the custom visuals in this repository, their publishers, legal terms, privacy agreements, support links and more go [here](https://github.com/DataChant/PowerBI-Visuals-AppSource/blob/main/Visuals%20Summary.md).

# FAQ
## General questions

Q: What is the source of the files in this repository?

> A: The single source of truth for all of the Power BI Custom Visuals in this repository is [Microsoft AppSource](https://appsource.microsoft.com/en-us/marketplace/apps?product=power-bi-visuals). All the files in this repository are periodically imported using a Microsoft public API (which is available to Microsoft partners).

Q: Are the custom visuals here up to date?

> A: We periodically refresh this repository, and [announce](https://github.com/DataChant/PowerBI-Visuals-AppSource/discussions/categories/announcements) what’s new with Power BI visuals on AppSource by finding the difference between commits. For a specific visual - to ensure you get the latest visual, you can download it from [Microsoft AppSource](https://appsource.microsoft.com/en-us/marketplace/apps?product=power-bi-visuals) and compare the version with this repository. To have a bulk downloader automation with the current snapshot from AppSource (and not rely on this repository for periodical refreshes) you can download our Excel Macro-enabled file. Learn more about it [here](https://datachant.com/2024/01/21/power-bi-custom-visuals-downloads/). [Contact us](https://forms.office.com/r/xZMuiaSdYh?origin=lprLink) if you have any questions about the tool or need help in automating your exports of custom visuals from AppSource.

## Questions by Power BI developers
### I am a Power BI developer with a Power BI Pro license -

Q: What are the benefits of downloading the PBIVIZ files from this repository and not from Power BI Desktop or Microsoft AppSource?

> A: To get the latest version of a custom visual, we recommend that you download the visual directly from Microsoft. However, if you cannot access the visuals, need to get an older version or a visual that is no longer available in AppSource, you may find it in this repository. Note: If you choose to use the files from this repository in your Power BI reports, please make sure you follow Microsoft [terms of use](https://learn.microsoft.com/en-us/legal/marketplace/marketplace-terms) and the ones shared by the publisher.

Q: Can I find in this repository older pbiviz files that are no longer available by Microsoft?

> A: Yes. You will find all versions of the visuals since January 2024 under **PBIVIZ with versions** subfolder that is under **All Visuals**,**Certified**, and **Uncertified** folders. In addition, if the visuals are no longer on AppSource, you will find their last version under the **Unlisted** [folder](https://github.com/DataChant/PowerBI-Visuals-AppSource/tree/main/Unlisted).

Q: What is the difference between the visual files in **PBIVIZ** and the ones in **PBIVIZ with versions** subfolder?
> A: The same visuals exist in both subfolders. However, in PBIVIZ subfolder, we store the latest version of each visual in a user-friendly filename. In PBIVIZ with versions, each visual may have multiple files with the versions in the filename suffix.

Q: What is the difference between **PBIVIZ** and **PBIVIZ with guid** subfolders?
> A: The same visuals exist in both subfolders but with different filenames. In PBIVIZ subfolder, we store the visuals in user-friendly filenames. In PBIVIZ with guid, we store the visuals with their official visual GUIDs as they are found in Power BI reports and extracted project files. The GUIDs will help you match visuals in your reports with the ones in this repository.

Q: How can I learn more about custom visuals that I found in this repository? 

> A: You can learn more about all the custom visuals on AppSource and contact the publishers. For a broader analysis of all custom visuals, you can install our Custom Visuals Exploration Tool [here](https://appsource.microsoft.com/en-us/product/power-bi/datachant-5311696.powerbi_customvisuals?tab=Overview). Learn more about it [here](https://datachant.com/custom-visuals-app/).

![](https://i0.wp.com/datachant.com/wp-content/uploads/2023/09/image-8.png?resize=1536%2C891&ssl=1)

### I am a Power BI developer without a Power BI account -

Q: I cannot download custom visuals in AppSource without logging in to a Microsoft account, can I use the PBIVIZ files in this repository to develop Power BI reports with custom visuals in Power BI Desktop?

> A: We recommend that you consult with your IT team before you use the files in this repository. Make sure you follow the terms of use in Power BI Desktop and agree to the license in this repository.

## Questions by Power BI administrators
Q: I am setting up Power BI Organizational Visuals. What are the benefits of using this repository?

> A: While you can import custom visuals directly from AppSource to define your Organizational Visuals, you can use this repository if you need to control the versions your users can use. In addition, this repository can help you audit a bulk of custom visuals (e.g. using a security scan of all the files) before you share them in your organization. You can learn more about Organizational Visuals [here](https://learn.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-faq#organizational-visuals).

## Questions by publishers
### I am a publisher of a custom visual that is available on Microsoft AppSource -

Q: Can I join as a contributor to share updates regarding my custom visuals?

> A: Yes. Contact us using the form above.

Q: Can I move my custom visuals from this repository?

> A: Yes. Contact us using the form above.

### I am a publisher of a custom visual that is not available on Microsoft AppSource -

Q: Can I publish my custom visuals in this repository?
>A: Not at this stage. Only published custom visuals are shared in this repository for the benefit of the Power BI Community.


