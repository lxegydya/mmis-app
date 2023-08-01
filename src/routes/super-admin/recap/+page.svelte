<script>
// @ts-nocheck

    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
    import ApiController from "../../../ApiController";
    import { onMount } from "svelte";
	import pagination from "../../../CustomPagination";
	import Pagination from "../../../components/pagination.svelte";
	import { toFormData } from "axios";
	import jquery from "jquery";
	import returnNada from "../../../CustomReturnNada";

    let datasReal = null
    let datas = null
    let status = null

    let currentPage = 1
    let showRowData = 10

    let getDatas = () => {
        ApiController({
            method:"GET",
            endpoint:'recap/get'
        }).then(response => {
            datasReal = response?.data.data
            datas = response?.data.data
            status = true
        })
    }

    let downloadSertificate = (type, d) => {
        ApiController({
            method:"POST",
            endpoint:`certificate/${type}`,
            datas:{
                mentee_id : d.id,
                program_id : d.program_id
            }
        }).then(response => {
            let downloadTrigger = document.createElement('a')
            downloadTrigger.setAttribute('href', `http://127.0.0.1/mmis-api/public${response.data.link}`)
            downloadTrigger.setAttribute('target', '_blank')
            downloadTrigger.click()
        })
    }

    let filterMentee = () => {
        currentPage = 1
        datas = datasReal
        let tempMentees = datas
        let targetName = jquery('#filter-name').val().toLowerCase()
        let targetUniversity = jquery('#filter-university').val().toLowerCase()

        tempMentees = tempMentees.filter(m => {
            return m.name.toLowerCase().includes(targetName) &&
                m.university.toLowerCase().includes(targetUniversity)
        })

        datas = tempMentees
    }

    onMount(async () => {
        getDatas()
    })
</script>

<svelte:head>
	<title>Recap</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="recap" role='admin'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='admin'/>
        <div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					Recap All Mentees Data
				</h4>
                {#if status}
                <div class="row">
                    <div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">All Data</h5>
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
                                            <th>Status</th>
                                            <th>Batch Name</th>
                                            <th>Program Name</th>
                                            <th>Group Name</th>
                                            <th>Mentor Name</th>
                                            <th class="text-center">Activity Absence</th>
                                            <th class="text-center">Pct. Absence</th>
                                            <th>Certificate of Absence</th>
                                            <th>Graded Assignment</th>
                                            <th>Avg. Score</th>
                                            <th>Certificate of Completetion</th>
										</tr>
									</thead>
									<tbody>
                                        {#if pagination(datas, currentPage, showRowData).length == 0}
                                        {returnNada(currentPage = currentPage-1)}
                                        {/if}
                                        {#each pagination(datas, currentPage, showRowData) as d, i}
                                        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                        <tr id="data-{d.id}" on:mouseover={() => jquery(`#data-${d.id}`).css('cursor', 'pointer')}
                                            on:click={() => window.location.href = `/super-admin/mentee/detail/${d.id}`}>
                                            <td class="text-center">{d.number}</td>
                                            <td>{d.id}</td>
                                            <td>{d.name}</td>
                                            <td>{d.gender}</td>
                                            <td>{d.university}</td>
                                            <td>{d.major}</td>
                                            <td>{d.semester}</td>
                                            <td>{d.email}</td>
                                            <td>{d.phone}</td>
                                            <td>{d.status}</td>
                                            <td>{d.batch_name}</td>
                                            <td>{d.program_name}</td>
                                            <td>{d.group_name}</td>
                                            <td>{d.mentor_name}</td>
                                            <td class="text-center">{d.present_count < 10 ? '0' + d.present_count : d.present_count} / {d.activity_count < 10 ? '0' + d.activity_count : d.activity_count}</td>
                                            <td class="text-center">{Math.round((d.present_count / d.activity_count) * 100)}%</td>
                                            {#if d.present_count < Math.ceil((d.activity_count * 80) / 100)}
                                                <td class="text-center text-danger">Not Eligible</td>
                                            {:else}
                                                <td class="text-center">
                                                    <button class="btn btn-sm btn-outline-primary" on:click={(evt) =>{
                                                        evt.stopPropagation()
                                                        downloadSertificate('absence' ,d)
                                                    }}>Download</button>
                                                </td>
                                            {/if}
                                            <td class="text-center">{d.scoring.count_graded < 10 ? '0' + d.scoring.count_graded : d.scoring.count_graded} / {d.scoring.count_assignment < 10 ? '0' + d.scoring.count_assignment : d.scoring.count_assignment}</td>
                                            <td class="text-center">{d.scoring.sum_score == 0 && d.scoring.count_assignment == 0 ? 0 : d.scoring.sum_score / d.scoring.count_assignment}</td>
                                            {#if d.scoring.count_graded == 0}
                                                <td class="text-center text-danger">Not Eligible</td>
                                            {:else}
                                                {#if d.scoring.count_graded == d.scoring.count_assignment}
                                                <td class="text-center">
                                                    <button class="btn btn-sm btn-outline-primary" on:click={(evt) => {
                                                        evt.stopPropagation()
                                                        downloadSertificate('score', d)
                                                    }}>Download</button>
                                                </td>
                                                {:else}
                                                <td class="text-center text-danger">Not Eligible</td>
                                                {/if}
                                            {/if}
                                        </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Pagination bind:currentPage={currentPage} bind:dataList={datas} showRowData={showRowData} />
                </div>
                {/if}
            </div>
        </div>
    </div>
</div>