# CUST access assurance demonstration

This is an illustrative ERPLeague client portal scenario. It contains synthetic roles, people, conflicts, SAP activity, and metrics. It does not connect to CUST or SAP systems.

## Open the demo

1. Start the site with `npm run dev` and open `/portal`. Its module cards lead to `/login`; you can also open `/login` directly.
2. Sign in with the sample User ID `iagcust` and password `iloveerp`.
3. Select **Run the scenario** for the complete walkthrough, or open a launchpad tile for its focused workspace. **Back to launchpad** returns to the tiles.

**Run the scenario** contains the cross-control status cards. The **Privileged Access** tile has seven color-coded case counters and a four-persona role play: **Executive** (blue), **Requester** (teal), **Security** (yellow), and **Auditor** (green). Its counter cards remain visible on the PAM flow and its evidence tab. Other tiles show only their own modules. **BTP Security & CoE** has its own identity and role play case. The synthetic cases persist in this browser session.

## Suggested six-minute conversation

| Step | Demonstrate | Point to make |
| --- | --- | --- |
| 1. Outcome cockpit | Switch roles in the left rail; read the four status cards. | Risk, review and evidence figures come from the same synthetic case. |
| 2. Access governance | Inspect the sample supplier maintenance plus invoice release conflict. Choose **Revise to least privilege**, edit the rationale, and record the decision. | Risk analysis should happen before the grant. A documented business decision and recheck determine what is actually provisioned. |
| 3. Alternative branch | Reset the scenario and choose **Time-limited mitigation**. Name the independent owner and validity window. | A mitigation retains residual risk; it does not make the conflicting privileges disappear. |
| 4. Privileged access | As **Requester**, inspect the reason. As **Executive**, approve it and show the sample email preview. Switch to **Requester**, start the session, run approved IW32 and a blocked SU01 attempt, then close it. As **Security**, record the log check. As **Auditor**, flag a follow-up. | Watch the Active, Closed, Pending review, Reviews complete, and Out-of-scope counters change. The PAM ID is usable only during the sample window. |
| 5. PAM evidence | Open either transaction row or **PAM evidence → Audit event trail**. Click any event to view its log and add a comment. Filter, download the audit CSV, and show the selected PAM review as print/PDF. | The denied transaction remains in the evidence and cannot be independently confirmed without a follow-up. |
| 6. Landscape fit | Review the proposed boundaries among enterprise identity, SAP Cloud Identity Services, SAP IAG, target SAP/BTP authorisations, and the portal. | ERPLeague configures standard SAP capabilities where suitable and confirms target connectors, ownership, logs, and retention in discovery. |

Each tile has its own route and shows only relevant modules. **ERP Landscape** opens Landscape fit and BTP Security & CoE. **Access Governance** links SoD decisions with only access reports and events; **Privileged Access** links its role play with only PAM reports and events. **Project Delivery** offers delivery stages and a delivery record, without SoD or PAM records in that tile. **BTP Security & CoE** contains its own identity, subaccount, role and visibility case. **Reports & Insights** and **Documents & Actions** retain the complete sample register and report catalogue. **Support Requests** and **Project Delivery** record sample actions in the audit trail.

The PAM stages are **Requested → Approved → Active → Closed/Expired → Reviewed**. An approval produces an **email preview only**; the site never sends a message or signs into SAP. The Requester must select the approved PAM ID within the displayed window. Security checks the closed log before an Auditor can finish the review. To demonstrate expiry without waiting, use **Fast-forward: expire sample access** while Approved or Active. Reset the scenario to run the branch with no flagged transactions; then the Auditor can confirm a clean review. Every event and comment in the modal is synthetic, and both logs and control ownership need validation with CUST.

## BTP Security & CoE: the strongest two-minute walkthrough

Open **BTP Security & CoE** on the launchpad. This uses a separate synthetic case and its own role play buttons. All names, subaccounts, regions, groups, roles, application screens and logs are invented for the presentation.

1. Leave the scenario at **Signed in, app missing**. Select a sample subaccount and show its **global account → directory → subaccount → region** path. Switching scope restarts this BTP case because role collections and assignments are scoped.
2. Switch to **Identity Ops** and run the IPS group sync. Explain that the synthetic `DEMO_ASSET_APPROVERS` group is now present in the CIS Identity Directory; this is not yet a BTP role assignment.
3. Switch to **Employee** and test sign-in and access. IAS succeeds but the sample app tile is hidden. Open the trace: the BTP group-to-role-collection mapping is missing in this subaccount.
4. Switch to **BTP Admin**. Browse the selected subaccount's role catalogue; distinguish the business approver role collection from **Subaccount Administrator**. Add an assignment reason and map the group to the approved business collection.
5. Switch to **Employee** and retest. The sample tile becomes visible and the sample approval action is permitted. Switch to **CoE Reviewer**, check the four control checkpoints, edit the independent review comment and close the case. Search or filter the event trail, then download its CSV or print/save the sample report.

For the alternative branches, choose **IPS group sync fails** to show a failed provisioning job and recovery, or **Excess admin privilege** to show a direct platform administrator grant that must be removed separately from the business app role. Each scenario selection starts a fresh sample trace. IAS, IPS and BTP records are simulated; actual trust, MFA, identity source, regional hosting, content visibility and authorisation must be confirmed with CUST.

The reset button returns the entire case to its starting position. The browser tab remembers the sample run until its session ends. The demo credentials and browser session flag are **not production authentication**.

## Measurable outcomes to establish in discovery

- Number and age of high-risk access requests awaiting a decision.
- Residual SoD risks with named, current mitigating controls and reviews.
- Proportion of privileged sessions independently reviewed within the agreed window.
- Completeness and retrieval time of request, approval, activity, and review evidence.
- Access certification completion and overdue exceptions, if in scope.

These are candidate measures, not a CUST baseline or promised improvement. SAP IAG product and integration fit, existing enterprise IGA/IDAM processes, application permissions, and evidence retention must be assessed with CUST before production design.
