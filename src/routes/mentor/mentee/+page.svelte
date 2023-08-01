<script>
// @ts-nocheck

    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
    import Footer from "../../../components/footer.svelte";
    import Pagination from "../../../components/pagination.svelte";
	import ApiController from "../../../ApiController";
	import { onMount } from "svelte";
	import jquery from "jquery";
	import pagination from "../../../CustomPagination";
	import returnNada from "../../../CustomReturnNada";

    let menteesReal = null
    let menteesList = null
    let menteesTotal = null
    let activeMenteesTotal = null
    let status = false

    let currentPage = 1
    let showRowData = 10

    let getMentees = () => {
        ApiController({
            method: "GET",
            endpoint: `mentees`
        }).then(response => {
            menteesReal = response?.data.data.mentees.sort((a, b) => a.name < b.name ? -1 : 1)
            menteesList = menteesReal

            menteesTotal = response?.data.data.mentees_total
            activeMenteesTotal = response?.data.data.active_mentees
            status = true
        })
    }

    let filterMentee = () => {
        currentPage = 1
        menteesList = menteesReal
        let tempMentees = menteesList
        let targetName = jquery('#filter-name').val().toLowerCase()
        let targetUniversity = jquery('#filter-university').val().toLowerCase()

        tempMentees = tempMentees.filter(m => {
            return m.name.toLowerCase().includes(targetName) &&
                m.university.toLowerCase().includes(targetUniversity)
        })

        menteesList = tempMentees
    }

    onMount(async () => {
        getMentees()
    })
</script>

<svelte:head>
	<title>Mentees</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="mentee" role='mentor'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='mentor'/>
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					Mentees
				</h4>
                {#if status}
                <div class="row">
                    <div class="col-lg-3 col-md-4 col-6 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex flex-row justify-content-between align-items-center">
									<div class="">
										<span class="fw-semibold d-block">Mentees Total</span>
										<div class="d-flex align-items-end gap-2">
											<h3 class="mb-0">{menteesTotal < 10 ? '0' + menteesTotal : menteesTotal}</h3>
											<span class="fw-light d-block">Mentees</span>
										</div>
									</div>
									<div class="d-flex align-items-center justify-content-center p-2">
										<i class='tf-icons bx bx-md bx-group'></i>
									</div>
								</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4 col-6 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex flex-row justify-content-between align-items-center">
									<div class="">
										<span class="fw-semibold d-block">Active Mentees Total</span>
										<div class="d-flex align-items-end gap-2">
											<h3 class="mb-0">{activeMenteesTotal < 10 ? '0' + activeMenteesTotal : activeMenteesTotal}</h3>
											<span class="fw-light d-block">Mentees</span>
										</div>
									</div>
									<div class="d-flex align-items-center justify-content-center p-2">
										<i class='tf-icons bx bx-md bx-user-check'></i>
									</div>
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
										<input type="text" class="form-control" placeholder="Mentee Name" id="filter-name" on:keyup={() => {filterMentee()}}>
                                    </div>
                                    <div class="input-group input-group-merge">
                                        <span class="input-group-text" id="basic-addon-search32"><i class="bx bx-search"></i></span>
										<input type="text" class="form-control" placeholder="University" id="filter-university" on:keyup={() => {filterMentee()}}>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th>No</th>
											<th>MSIB ID</th>
											<th>Name</th>
											<th>Gender</th>
											<th>University</th>
											<th>Major</th>
											<th>Semester</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Group Name</th>
                                            <th>Status</th>
										</tr>
									</thead>
									<tbody>
                                    {#if menteesList.length > 0}
                                    {#if pagination(menteesList, currentPage, showRowData).length == 0}
                                    {returnNada(currentPage = currentPage-1)}
                                    {/if}
                                    {#each pagination(menteesList, currentPage, showRowData) as m, i}
                                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                    <tr id="data-{m.id}" on:click={() => window.location.href = `/mentor/mentee/detail/${m.id}`}
                                        on:mouseover={() => jquery(`#data-${m.id}`).css('cursor', 'pointer')}>
                                        <td class="text-center">{m.number}</td>
                                        <td>{m.id}</td>
                                        <td>{m.name}</td>
                                        <td class="text-center">{m.gender}</td>
                                        <td>{m.university}</td>
                                        <td>{m.major}</td>
                                        <td class="text-center">{m.semester}</td>
                                        <td>{m.email}</td>
                                        <td>{m.phone}</td>
                                        <td class="text-center {m.group_name == null ? 'text-danger' : ''}">
                                            {m.group_name == null ? 'Not Assign Yet' : m.group_name}
                                        </td>
                                        <td class="text-center {m.status == 'Active' ? 'text-success' : 'text-danger'}">{m.status}</td>
                                    </tr>
                                    {/each}
                                    {:else}
                                    <tr>
                                        <td colspan="12" class="text-center">No Data</td>
                                    </tr>
                                    {/if}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Pagination bind:currentPage={currentPage} bind:dataList={menteesList} showRowData=10/>
                </div>
                {/if}
            </div>
        </div>
        <Footer/>
    </div>
</div>