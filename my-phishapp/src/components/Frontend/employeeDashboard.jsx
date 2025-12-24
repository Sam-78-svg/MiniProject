function employeeDashboard() {
    return (
        <>
            <nav class="navbar navbar-light bg-light">
                <div class="container-fluid">
                    <span class="navbar-brand mb-0 h1">Employee Security Portal</span>
                    <a href="login.html" class="btn btn-outline-secondary btn-sm">Logout</a>
                </div>
            </nav>

            <div class="container mt-4">
                <div class="row">
                    <div class="col-md-4">
                        <div class="card text-white bg-success mb-3">
                            <div class="card-header">Security Score</div>
                            <div class="card-body">
                                <h1 class="card-title display-4 text-center">85/100</h1>
                                <p class="card-text text-center">Good job! Keep staying vigilant.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">Recent Activity & Feedback</div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item list-group-item-warning">
                                    <strong>Warning:</strong> You clicked a simulated phishing link on 11/1/2025.
                                    <br /><small class="text-muted">Tip: Always hover over links to see the actual URL before
                                        clicking.</small>
                                </li>
                                <li class="list-group-item list-group-item-success">
                                    <strong>Success:</strong> You correctly reported a suspicious email on 10/05/2025.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default employeeDashboard;