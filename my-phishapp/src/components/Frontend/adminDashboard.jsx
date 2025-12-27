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


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/save_campaign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    campaign_name: campaignName,
                    email_template: emailTemplate,
                    target_group: targetGroup
                })
            });

            const result = await response.json();

            if (response.ok) {
                const link = window.location.origin + "/feedback";
                setSuccessLink(link);
                setShowSuccess(true);
                // Optionally reset form
                setCampaignName("");
                setEmailTemplate("Password Expiry Notification");
                setTargetGroup("All Employees");
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server.');
        }
    };

    useEffect(() => {
        if (activeTab === "reports") {
            fetchReports();
        }
    }, [activeTab]);

    const fetchReports = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/reports");
            const data = await response.json();
            console.log(data);
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
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
                                        <th>email_template</th>
                                        <th>target_group</th>
                                        <th>Sent Date</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report, idx) => (
                                        <tr key={idx}>
                                            <td>{report.campaign_name}</td>
                                            <td>{report.email_template}</td>
                                            <td>{report.target_group}</td>
                                            <td>{report.sent_date}</td>
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