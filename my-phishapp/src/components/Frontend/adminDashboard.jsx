import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
    const [campaignName, setCampaignName] = useState("");
    const [emailTemplate, setEmailTemplate] = useState("Password Expiry Notification");
    const [targetGroup, setTargetGroup] = useState("All Employees");
    const [successLink, setSuccessLink] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [reports, setReports] = useState([]);
    const [activeTab, setActiveTab] = useState("create");
    const [uploadFile, setUploadFile] = useState(null);
    const [breachCount, setBreachCount] = useState(0);
    const [numberOfEmails, setNumberOfEmails] = useState(""); // New state for number of emails

    useEffect(() => {
        // Get breach count from localStorage on mount
        setBreachCount(Number(localStorage.getItem("breachCount") || 0));
    }, [showSuccess]); // update when a campaign is launched

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("campaign_name", campaignName);
        formData.append("email_template", emailTemplate);
        formData.append("target_group", targetGroup);
        formData.append("file", uploadFile);
        formData.append("number_of_emails", numberOfEmails);

        try {
            const response = await fetch('http://localhost:5000/api/save_campaign', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                const link = window.location.origin + "/feedback";
                setSuccessLink(link);
                setShowSuccess(true);

                const detectedEmails = result.emailCount || numberOfEmails;
                setReports(prev => [
                    ...prev,
                    {
                        campaign_name: campaignName,
                        sent_date: new Date().toLocaleDateString(),
                        emails_sent: detectedEmails,
                        clicked_link: breachCount,
                        vulnerability_rate:
                            detectedEmails && Number(detectedEmails) > 0
                                ? ((breachCount / Number(detectedEmails)) * 100).toFixed(1) + "%"
                                : "--"
                    }
                ]);

                // Optionally reset form
                setCampaignName("");
                setEmailTemplate("Password Expiry Notification");
                setTargetGroup("All Employees");
                setUploadFile(null);
                setNumberOfEmails(""); // Reset number of emails
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server.');
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <span className="navbar-brand">Phishing Simulator Admin</span>
                    <div className="d-flex">
                        <Link to="/login" className="btn btn-outline-light btn-sm">Logout</Link>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <ul className="nav nav-tabs" id="adminTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link${activeTab === "create" ? " active" : ""}`}
                            type="button"
                            onClick={() => setActiveTab("create")}
                        >
                            Create Campaign
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link${activeTab === "reports" ? " active" : ""}`}
                            type="button"
                            onClick={() => setActiveTab("reports")}
                        >
                            Awareness Reports
                        </button>
                    </li>
                </ul>
                <div className="tab-content p-3 border border-top-0 rounded-bottom" id="myTabContent">
                    {activeTab === "create" && (
                        <div className="tab-pane fade show active" id="create" role="tabpanel">
                            <h4>Create New Phishing Simulation</h4>
                            <form className="mt-3" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Campaign Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g., 'Urgent Payroll Update'"
                                        required
                                        value={campaignName}
                                        onChange={e => setCampaignName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email Template</label>
                                    <select
                                        className="form-select"
                                        value={emailTemplate}
                                        onChange={e => setEmailTemplate(e.target.value)}
                                    >
                                        <option>Password Expiry Notification</option>
                                        <option>Urgent Document Shared</option>
                                        <option>Unusual Sign-in Activity</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Target Group</label>
                                    <select
                                        className="form-select"
                                        value={targetGroup}
                                        onChange={e => setTargetGroup(e.target.value)}
                                    >
                                        <option>All Employees</option>
                                        <option>Finance Dept</option>
                                        <option>IT Dept</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Upload PDF or Excel</label>
                                    <input
                                        type="file"
                                        accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        className="form-control"
                                        onChange={e => setUploadFile(e.target.files[0])}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-success">Launch Campaign</button>
                            </form>
                            {showSuccess && (
                                <div className="alert alert-success mt-3">
                                    Campaign launched! Simulation link generated: <strong>{successLink}</strong>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "reports" && (
                        <div className="tab-pane fade show active" id="reports" role="tabpanel">
                            <h4>Campaign Performance & Awareness Reports</h4>
                            <table className="table table-striped mt-3">
                                <thead>
                                    <tr>
                                        <th>Campaign Name</th>
                                        <th>Sent Date</th>
                                        <th>Clicked Link</th>
                                        <th>Vulnerability Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report, idx) => (
                                        <tr key={idx}>
                                            <td>{report.campaign_name}</td>
                                            <td>{report.sent_date}</td>
                                            <td>{breachCount}</td>
                                            <td>
                                                {report.emails_sent !== "--" && report.emails_sent > 0
                                                    ? ((breachCount / report.emails_sent) * 100).toFixed(1) + "%"
                                                    : "--"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;