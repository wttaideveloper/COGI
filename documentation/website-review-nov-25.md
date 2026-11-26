# Website review implementation

The supplied review requests a clearer homepage hierarchy, more engaging programs and stories, a natural-looking interactive Earth, and complete people and resource content. The mission and Our Story sections were explicitly approved and remain unchanged. This implementation updates the local website; it does not publish a deployment or modify live CMS records.

## Review and implementation decisions

| Feedback | Local result and remaining work |
| --- | --- |
| Remove the box around the logo or use a light hero | Removed the logo background and padding. The supplied white mark remains white over the homepage hero; a dark filter keeps it visible on light headers. The original full-color logo was not available. |
| Introductory video placeholder | Added an image and honest coming-soon caption when no video URL is configured; existing video URLs still take precedence. |
| Methods before portfolio and balanced layout | Existing defaults already put methods before portfolio. Removed the staggered two-column arrangement in favor of three aligned columns. CMS section ordering remains editable. |
| Complete the portfolio | A centered flexible layout accommodates an odd number of programs without an empty final grid slot. Existing program URLs are preserved. |
| Crossing the Faultline of Work | Not invented or published: approved description, scope and program content are needed. The layout no longer requires a sixth program to look complete. |
| Moving stories with one emphasized | Added a horizontal carousel using all returned stories, with active emphasis, previous/next and pause controls, hover/focus pause and reduced-motion support. |
| Natural spinning globe | Replaced dotted continents and orbital rings with solid, shaded land and ocean. Existing drag, keyboard, country controls and automatic rotation remain. Country information sits alongside the globe on desktop. This remains an illustration, not a satellite-textured Earth; rotation pauses for interaction and reduced-motion preferences. |
| Country programs and partners | Existing program and team information remains available. Existing limited CMF partner labels remain; comprehensive country-to-partner data needs verification against the missing reference list. |
| Remove globe from Vision and Mission | Removed the duplicate globe from About. It remains in the homepage Where We Serve section. |
| Board photographs beside profiles | Profile dialogs now display the configured photograph beside details, with initials when no photo exists. Actual missing portraits must be supplied. |
| Global team photographs and responsibilities | Existing page already supports photos, roles and biographies. Missing verified portraits and responsibilities remain a content dependency. |
| Beliefs wording and size | Updated to “We subscribe to the central beliefs of the Church.” Enlarged the introduction and belief body text. Exact legacy wording is migrated when loading saved copy. |
| Additional partners | The review references another document but does not contain its list. Reconciliation awaits that document. |
| Programs outside boxes | Replaced the boxed grid with numbered editorial rows, retaining descriptions, experiences and program links. |
| Homepage events instead of a separate page | Retained the existing event route for detail/calendar access and the homepage upcoming-event section. Added prominent date tiles. Actual event photography is still needed for photographic thumbnails. |
| Resources completion | The document names Olwale, Frances, Joash, Gideon and Jaison but supplies no story text, blog manuscripts, contribution text or KOG video URL. These cannot be responsibly reconstructed from names. Existing resources structure remains. |
| Inviting donation language | Updated default and bundled copy to invite gifts as small as the cost of a coffee while preserving the existing donation destination. Live CMS overrides may need editorial updates. |
| Improve photos without changing identity | No facial edits were performed. Source portraits are needed before assessing enhancement; identity should be checked against each original. |

## Content needed to finish the review

- Original full-color COGI logo, if the white mark is to be replaced.
- Approved board and global-team portraits, matched to names, plus missing responsibilities.
- The separate partner reference document and verified country associations.
- Final introduction and KOG video files or URLs.
- Blog manuscripts, the five named stories and team contributions.
- Approved Crossing the Faultline of Work program content, if it should be added.
- Event photographs and a licensed satellite Earth texture if photographic treatments are required.

## Validation

The public production build and all 13 existing public tests passed after directing the test cache to a writable workspace directory. The build reports a large JavaScript chunk warning. Document text was extracted from Word XML; page rendering was unavailable because the bundled environment did not provide LibreOffice, so no claim is made about the Word document's visual formatting.

Both public and admin production builds pass. Browser visual verification remains outstanding: the bundled Chromium browser was absent and installed Edge exited during automated launch. The changes have not been deployed.


## Interactive globe update

The homepage globe now uses a locally bundled NASA Blue Marble satellite texture, credited beside the globe and in images/earth-attribution.txt. It rotates continuously even with a country panel open. Dragging temporarily takes control; pause and reduced-motion settings stop rotation. Country pins and country buttons select the adjacent panel, which stacks below the Earth on mobile. Programs, partners and team members are displayed from available data. Existing CMF associations were moved from hardcoded presentation into country records; they have not been independently revalidated against the missing partner document. Other missing associations display a coming-soon message. Partners can now be maintained in the admin Locations form and the Strapi location schema. Restart the CMS when applying the schema update.

Browser checks confirmed rotation while selected, pause behavior, stationary rendering with reduced motion on initial load, and no mobile horizontal overflow or page errors. Both public and admin builds pass.

Photo assessment: the bundled photography ranges from 1024 to 1440 pixels wide, while homepage-c4c-india.jpg and homepage-workshop.jpg retain 4160-pixel originals. Prefer those original-resolution sources where appropriate. Generative face restoration cannot guarantee unchanged identity; it was not applied. Any future AI denoising or upscaling should run on copies with face reconstruction disabled, with each face compared against the source before publication. No photographic facial features were modified.
