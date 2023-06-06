<script>
// @ts-nocheck

    import Sidebar from "../../../../components/sidebar.svelte";
    import Navbar from "../../../../components/navbar.svelte";
    import jquery from "jquery";
	import ApiController from "../../../../ApiController";
	import { onMount } from "svelte";

    let currentStep = 0

    let batches = null
    let programs = null
    let mentors = null
    let mentees = null

    let statusOne = false
    let statusTwo = false
    let statusThree = false
    let statusFour = false
    let statusFive = false

    let selectedBatch = null
    let selectedProgram = null
    let selectedMentor = null
    let selectedMentee = []

    let getBatch = () => {
        if(!statusOne){
            ApiController({
                method:"GET",
                endpoint:`batches/not-finished`
            }).then(response => {
                batches = response?.data.data
                currentStep = 1
                statusOne = true
            })
        }
    }

    let getProgram = () => {
        if(!statusTwo){
            ApiController({
                method:"GET",
                endpoint:`program/batch/${selectedBatch}`
            }).then(response => {
                programs = response.data.data
                currentStep = 2
                statusTwo = true
            })
        }else{
            if(programs.filter(p => p.batch_id == selectedBatch).length == 0){
                ApiController({
                    method:"GET",
                    endpoint:`program/batch/${selectedBatch}`
                }).then(response => {
                    programs = response.data.data
                    currentStep = 2
                    statusTwo = true
                })
            }
        }
    }

    let getMentor = () => {
        if(!statusThree){
            ApiController({
                method:"POST",
                endpoint:`mentor/not-in-group/${selectedProgram}`
            }).then(response => {
                mentors = response.data.data
                currentStep = 3
                statusThree = true
            })
        }
    }

    let getMentee = () => {
        if(!statusFour){
            ApiController({
                method:"GET",
                endpoint:`mentee/not-in-group`
            }).then(response => {
                mentees = response.data.data
                currentStep = 4
                statusFour = true
            })
        }
    }

    let createGroup = () => {
        let group = {
            program_id:selectedProgram,
            mentor_id:selectedMentor,
            mentees:selectedMentee.map(m => m.id),
            name:jquery('#group-name').val(),
            status:'Active'
        }

        ApiController({
            method:"POST",
            endpoint:"group/create",
            datas:group
        }).then(response => {
            if(response?.data.msg == 'success'){
                alert(`Group Created!`)
                window.location.href = '/super-admin/group'
            }
        })
    }

    onMount(async () => {
        getBatch()
    })

</script>

<div class="d-flex h-100">
	<Sidebar activePage="group" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-mouse-events-have-key-events -->
					<span
						id="nav-back-link"
						class="text-muted fw-light"
						on:click={() => {
							window.history.back();
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Groups /</span
					> Create
				</h4>
				<div class="row mb-3">
                    <div class="col-md-12">
                        <div class="list-group list-group-horizontal-md text-md-center align-items-center">
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="list-group-item list-group-item-action {currentStep == 1 ? 'active' : ''}" id="step-1" on:click={() => {
                                currentStep = 1
                            }}>Choose Batch</div>
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="list-group-item list-group-item-action {currentStep == 2 ? 'active' : ''}" id="step-2" on:click={() => {
                                if(selectedBatch == null){
                                    alert('Please complete the step one by one!')
                                    return 0
                                }

                                currentStep = 2
                                getProgram()
                            }}>Choose Program</div>
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="list-group-item list-group-item-action {currentStep == 3 ? 'active' : ''}" id="step-3" on:click={() => {
                                if(selectedProgram == null){
                                    alert('Please complete the step one by one!')
                                    return 0
                                }

                                currentStep = 3
                                getMentor()
                            }}>Select Group's Mentor</div>
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="list-group-item list-group-item-action {currentStep == 4 ? 'active' : ''}" id="step-4" on:click={() => {
                                if(selectedMentor == null){
                                    alert('Please complete the step one by one!')
                                    return 0
                                }

                                currentStep = 4
                                getMentee()
                            }}>Assign Mentees</div>
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="list-group-item list-group-item-action {currentStep == 5 ? 'active' : ''}" id="step-5" on:click={() => {
                                if(selectedMentee.length == 0){
                                    alert('Please complete the step one by one!')
                                    return 0
                                }

                                statusFive = true
                                currentStep = 5
                            }}>Finalization</div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    {#if currentStep == 1}
                    {#if statusOne}
                    {#each batches as b}
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="col-lg-2 col-md-4 col-6 mb-4" on:mouseover={() => {
                        jquery(`#b-0${b.id}`).css('cursor', 'pointer')
                    }} on:click={() => {
                        if(selectedBatch == null){
                            selectedBatch = b.id
                        }else{
                            if(selectedBatch == b.id){
                                selectedBatch = null
                            }else{
                                selectedBatch = b.id
                            }
                        }
                    }}>
                        <div class="card mb-3 {selectedBatch == b.id ? 'border border-success' : ''}" id="b-0{b.id}">
                            <div class="card-body">
                                <h5 class="card-title">{b.batch_name}</h5>
                                <p class="card-text">
                                {b.batch_status}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/each}
                    {/if}
                    {:else if currentStep == 2}
                    {#if statusTwo}
                    {#each programs as p}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    <div class="col-lg-4 col-md-6 col-6 mb-4" on:mouseover={() => {
                        jquery(`#p-0${p.id}`).css('cursor', 'pointer')
                    }} on:click={() => {
                        if(selectedProgram == null){
                            selectedProgram = p.id
                        }else{
                            if(selectedProgram == p.id){
                                selectedProgram = null
                            }else{
                                selectedProgram = p.id
                            }
                        }
                    }}>
                        <div class="card mb-3 {selectedProgram == p.id ? 'border border-success' : ''}" id="p-0{p.id}">
                            <div class="card-header">{p.batch_name}</div>
                            <div class="card-body">
                                <h5 class="card-title">{p.program_name}</h5>
                                <p class="card-text">{p.program_desc}</p>
                            </div>
                        </div>
                    </div>
                    {/each}
                    {/if}
                    {:else if currentStep == 3}
                    {#if statusThree}
                    {#each mentors as m}
                    <!-- svelte-ignore missing-declaration -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    <div class="col-lg-4 col-md-6" on:mouseover={() => {
                        jquery(`#m-0${m.id}`).css('cursor', 'pointer')
                    }} on:click={() => {
                        if(selectedMentor == null){
                            selectedMentor = m.id
                        }else{
                            if(selectedMentor == m.id){
                                selectedMentor = null
                            }else{
                                selectedMentor = m.id
                            }
                        }
                    }}>
                        <div class="card mb-3 {selectedMentor == m.id ? 'border border-success' : ''}" id="m-0{m.id}">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <!-- svelte-ignore a11y-img-redundant-alt -->
                                    <img class="card-img card-img-left" src="http://127.0.0.1/mmis-api/public/{m.image}" alt="Card image">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title">{m.fullname}</h5>
                                        <p class="card-text">{m.skill}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/each}
                    {/if}
                    {:else if currentStep == 4}
                    {#if statusFour}
                    <div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Mentees</h5>
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
										</tr>
									</thead>
									<tbody>
                                    {#if statusFour}
                                    {#if mentees.length > 0}
                                    {#each mentees as m}
                                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                    <tr id="data-{m.id}" class="{selectedMentee.includes(m) ? 'table-success' : ''}" on:click={() => {
                                            if(selectedMentee.includes(m)){
                                                selectedMentee = selectedMentee.filter(mentee => {
                                                    return mentee.id != m.id
                                                })
                                                jquery(`#data-${m.id}`).removeClass('table-success')
                                            }else{
                                                selectedMentee.push(m)
                                                jquery(`#data-${m.id}`).addClass('table-success')
                                            }

                                            console.log(selectedMentee)
                                        }}
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
                                    </tr>
                                    {/each}
                                    {/if}
                                    {/if}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/if}
                    {:else if currentStep == 5}
                    {#if statusFive}
                    <div class="col-md-12">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-3">
                                    <h5 class="card-title">Detail Group</h5>
                                    <button class="btn btn-primary" on:click={() => {
                                        if(jquery('#group-name').val() == ""){
                                            alert('Fill up the group name!')
                                            return 0
                                        }

                                        createGroup()
                                    }}>Create Group</button>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label" for="group-name">Group Name</label>
                                        <input type="text" class="form-control" id="group-name" placeholder="Group Name">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <p class="text-muted mb-0">Selected Batch</p>
                                        <p class="lead mb-0">{batches.filter(b => b.id == selectedBatch)[0].batch_name}</p>
                                    </div>
                                    <div class="col-md-4">
                                        <p class="text-muted mb-0">Selected Program</p>
                                        <p class="lead mb-0">{programs.filter(p => p.id == selectedProgram)[0].program_name}</p>
                                    </div>
                                    <div class="col-md-4">
                                        <p class="text-muted mb-0">Selected Mentor</p>
                                        <p class="lead mb-0">{mentors.filter(m => m.id == selectedMentor)[0].fullname}</p>
                                    </div>
                                </div>
                                <div class="card shadow-none bg-transparent border border-secondary mb-3">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h5 class="card-header">Selected Mentees</h5>
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
                                                    {#if selectedMentee.length > 1}
                                                    <th>Action</th>
                                                    {/if}
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {#if selectedMentee.length > 0}
                                            {#each selectedMentee as m}
                                            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                            <tr id="data-{m.id}">
                                                <td>{m.id}</td>
                                                <td>{m.name}</td>
                                                <td class="text-center">{m.gender}</td>
                                                <td>{m.university}</td>
                                                <td>{m.major}</td>
                                                <td class="text-center">{m.semester}</td>
                                                <td>{m.email}</td>
                                                <td>{m.phone}</td>
                                                <td class="text-center {m.status == 'Active' ? 'text-success' : 'text-danger'}">{m.status}</td>
                                                {#if selectedMentee.length > 1}
                                                <td>
                                                    <button class="btn btn-sm btn-outline-danger" on:click={() => {
                                                        selectedMentee = selectedMentee.filter(mentee => {
                                                            return mentee.id != m.id
                                                        })
                                                    }}>Remove</button>
                                                </td>
                                                {/if}
                                            </tr>
                                            {/each}
                                            {/if}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/if}
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>