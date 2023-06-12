<script>
// @ts-nocheck

    import Sidebar from "../../../../../components/sidebar.svelte";
	import Navbar from "../../../../../components/navbar.svelte";
	import Footer from "../../../../../components/footer.svelte";
	import Pagination from "../../../../../components/pagination.svelte";
	import ApiController from "../../../../../ApiController";
	import { onMount } from "svelte";
    import jquery from "jquery";
	import toDate from "../../../../../CustomTime";
	import pagination from "../../../../../CustomPagination";

	export let data

	let program = null
	let types = null
	let assignmentsReal = null
	let assignments = null
	let status = false

	let currentPage = 1
	let showRowData = 10

	let getAssignments = () => {
		ApiController({
			method:"GET",
			endpoint:`assignments/${data.params.slug}`
		}).then(response => {
			program = response.data.data.program
			types = response.data.data.types
			assignmentsReal = response.data.data.assignments
			assignments = assignmentsReal

			status = true
		})
	}

	let filterActivities = () => {
		activities = activitiesReal
		let tempActivities = activities
		let targetName = jquery('#filter-name').val().toLowerCase()
		let targetType = jquery('#filter-type').val().toLowerCase()

		tempActivities = tempActivities.filter(temp => {
			return temp.name.toLowerCase().includes(targetName) &&
				temp.type.toLowerCase().includes(targetType)
		})

		tempActivities.forEach((temp, i) => {
			temp.numbering = i+1
		})

		activities = tempActivities
	}

    onMount(async () => {
        getAssignments()
    })
</script>

<svelte:head>
	<title>Scoring | {status ? `[${program.batch_name}] ${program.program_name}` : ''}</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="scoring" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					<!-- svelte-ignore a11y-mouse-events-have-key-events -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span
						id="nav-back-link"
						class="text-muted fw-light"
						on:click={() => {
							window.location.href = '/super-admin/scoring';
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Scorings /</span
					> {status ? `[${program.batch_name}] ${program.program_name}` : ''}
				</h4>
				{#if status}
				<div class="row">
                    <div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">List of Assignments</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="filter-name" placeholder="Assignment Title" on:keyup={() => {
											filterActivities()
										}}>
                                    </div>
									<div class="input-group">
                                        <select id="filter-type" class="form-select" on:change={() => {
											filterActivities()
										}}>
                                            <option value="" selected>All Type</option>
											{#each types as t}
                                            <option value="{t.type}" >{t.type}</option>
											{/each}
                                        </select>
                                    </div>
                                </div>
                            </div>
							<div class="table-responsive">
								<table class="table table-hover">
									<thead>
										<tr class="">
											<th class="text-center">NO.</th>
											<th>Assignment Title</th>
											<th style="max-width: 300px; ">Description</th>
											<th class="text-center">Deadline</th>
											<th class="text-center">Submitted</th>
                                            <th class="text-center">Type</th>
											<th class="text-center">Action</th>
										</tr>
									</thead>
                                    <tbody>
                                        {#each pagination(assignments, currentPage, showRowData) as a, i}
                                        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                        <tr id="data-{a.id}" 
											on:click={() => window.location.href = `/super-admin/absence/fill-absence/list/${a.id}`}
											on:mouseover={() => jquery(`#data-${a.id}`).css('cursor', 'pointer')}>
                                            <td class="text-center">{i+1}</td>
                                            <td>{a.name}</td>
                                            <td style="max-width: 300px; ">{a.description}</td>
                                            <td class="text-center">{toDate(a.deadline)}</td>
											<td class="text-center">{a.mentees_count < 10 ? '0' + a.mentees_count : a.mentees_count} / {a.mentees_total}</td>
                                            <td class="text-center">{a.type}</td>
                                            <td class="text-center">
                                                <button class="btn btn-sm btn-outline-primary">Appraise</button>
                                            </td>
                                        </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
					<Pagination bind:currentPage={currentPage} bind:dataList={assignments} showRowData={showRowData} position='end'/>
                </div>
				{/if}
			</div>
		</div>
		<Footer/>
	</div>
</div>