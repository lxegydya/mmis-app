<script>
// @ts-nocheck

    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
	import ApiController from "../../../ApiController";
	import { onMount } from "svelte";
	import jquery from "jquery";

    let menteesList = null
    let menteesTotal = null
    let activeMenteesTotal = null
    let status = false

    let getMentees = () => {
        ApiController({
            method: "GET",
            endpoint: `mentees`
        }).then(response => {
            sortData(response?.data.data.mentees)
            menteesTotal = response?.data.data.mentees_total
            activeMenteesTotal = response?.data.data.active_mentees
            status = true
        })
    }

    let sortData = (data) => {
        menteesList = data
        menteesList = menteesList.sort((a,b) => {
            let x = a.name.toLowerCase()
            let y = b.name.toLowerCase()

            if(x>y){return 1}
            if(x<y){return -1}
            return 0
        })
    }

    onMount(async () => {
        getMentees()
    })
</script>

<div class="d-flex h-100">
	<Sidebar activePage="mentee" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					Mentees
				</h4>
                {#if status}
                <div class="row">
                    <div class="col-lg-2 col-md-2 col-6 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="card-title d-flex align-items-start justify-content-between">
                                    <div class="avatar flex-shrink-0">
                                        <img
                                            src="/img/icons/unicons/chart-success.png"
                                            alt="chart success"
                                            class="rounded"
                                        />
                                    </div>
                                </div>
                                <span class="fw-semibold d-block mb-1">Mentees Total</span>
                                <div class="d-flex align-items-center gap-2">
                                    <h3 class="card-title mb-2">{menteesTotal < 10 ? '0' + menteesTotal : menteesTotal}</h3><span class="fw-light d-block mb-1">Mentees</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-2 col-6 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="card-title d-flex align-items-start justify-content-between">
                                    <div class="avatar flex-shrink-0">
                                        <img
                                            src="/img/icons/unicons/chart-success.png"
                                            alt="chart success"
                                            class="rounded"
                                        />
                                    </div>
                                </div>
                                <span class="fw-semibold d-block mb-1">Active Mentees Total</span>
                                <div class="d-flex align-items-center gap-2">
                                    <h3 class="card-title mb-2">{activeMenteesTotal < 10 ? '0' + activeMenteesTotal : activeMenteesTotal}</h3><span class="fw-light d-block mb-1">Mentees</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
					<div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Mentees</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <span class="input-group-text" id="basic-addon-search31"><i class="bx bx-search"></i></span>
										<input type="text" class="form-control" placeholder="Mentee Name" id="filter-name">
                                    </div>
                                    <button type="button" class="btn btn-primary text-nowrap" on:click={() => window.location.href = '/super-admin/mentee/create'}>
                                        <span class="tf-icons bx bx-plus me-1"></span>Mentee
                                    </button>
                                </div>
                            </div>
                            <div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th>ID</th>
											<th>Name</th>
											<th>Gender</th>
											<th>University</th>
											<th>Major</th>
											<th>Semester</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                            <th>Action</th>
										</tr>
									</thead>
									<tbody>
                                    {#if menteesList.length > 0}
                                    {#each menteesList as m}
                                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                    <tr id="data-{m.id}" on:click={() => window.location.href = `/super-admin/mentee/detail/${m.id}`}
                                        on:mouseover={() => jquery(`#data-${m.id}`).css('cursor', 'pointer')}>
                                        <td>{m.id}</td>
                                        <td>{m.name}</td>
                                        <td class="text-center">{m.gender}</td>
                                        <td>{m.university}</td>
                                        <td>{m.major}</td>
                                        <td class="text-center">{m.semester}</td>
                                        <td>{m.email}</td>
                                        <td>{m.phone}</td>
                                        <td class="text-center {m.status == 'Active' ? 'text-success' : 'text-danger'}">{m.status}</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-warning" on:click={(event) => {
                                                event.stopPropagation()
                                                window.location.href = `/super-admin/mentee/edit/${m.id}`
                                            }}>Edit</button>
                                            <button class="btn btn-sm btn-outline-danger">Delete</button>
                                        </td>
                                    </tr>
                                    {/each}
                                    {/if}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/if}
            </div>
        </div>
    </div>
</div>