import { useEffect, useMemo, useState } from "react";
import { BsArrowReturnRight } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";
import { RiProgress5Line } from "react-icons/ri";
import { IoMdDoneAll } from "react-icons/io";
import { FaFolderOpen } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loadingspinner";
import { AvatarCircles } from "../components/AvatarCircles";
import { useAuth } from "../context/AuthContext";
import { getProjectMembers, getProjects } from "../services/projectService";
import { getTasks } from "../services/taskService";

const EMPTY_LIST = [];

const SUMMARY_CARDS = [
  {
    icon: <FaTasks className="h-3.5 w-3.5" aria-hidden="true" />,
    label: "Total",
    getValue: (summary) => summary.total,
    pill: "All tasks",
    pillClass: "bg-[#eef5ff] text-[#2672d8]",
  },
  {
    icon: <FaFolderOpen className="h-3.5 w-3.5" aria-hidden="true" />,
    label: "Projects",
    getValue: (_, projectCount) => projectCount,
    pill: "All projects",
    pillClass: "bg-[#f2f2f2] text-[#4d4d4d]",
  },
  {
    icon: <RiProgress5Line className="h-3.5 w-3.5" aria-hidden="true" />,
    label: "In Progress",
    getValue: (summary) => summary.inProgress,
    pill: "Active work",
    pillClass: "bg-[#fff3e0] text-[#ab570a]",
  },
  {
    icon: <IoMdDoneAll className="h-3.5 w-3.5" aria-hidden="true" />,
    label: "Done",
    getValue: (summary) => summary.completed,
    pill: "Completed",
    pillClass: "bg-[#d9f7ec] text-[#13795b]",
  },
];

const getResponseList = (response) =>
  Array.isArray(response?.data) ? response.data : EMPTY_LIST;

const getProjectList = (entries) =>
  entries.map((entry) => entry?.project).filter((project) => project?._id);

const roleLabel = (role) =>
  role?.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase()) ||
  "Member";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState({});
  const [tasks, setTasks] = useState([]);
  const [projectsError, setProjectsError] = useState("");
  const [tasksError, setTasksError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    let isCurrent = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setProjectsError("");
      setTasksError("");

      try {
        const projectsResponse = await getProjects();
        const projectEntries = getResponseList(projectsResponse);

        if (!isCurrent) {
          return;
        }

        setProjects(projectEntries);

        const projectList = getProjectList(projectEntries);

        const [taskResults, memberResults] = await Promise.all([
          Promise.allSettled(
            projectList.map(async (project) => {
              const response = await getTasks(project._id);
              const projectTasks = getResponseList(response);

              return projectTasks.map((task) => ({
                ...task,
                projectId: project._id,
                projectName: project.name,
              }));
            }),
          ),
          Promise.allSettled(
            projectList.map(async (project) => {
              const response = await getProjectMembers(project._id);
              return {
                projectId: project._id,
                members: getResponseList(response),
              };
            }),
          ),
        ]);

        if (!isCurrent) {
          return;
        }

        const failedTaskRequests = taskResults.filter(
          (result) => result.status === "rejected",
        );
        const loadedTasks = taskResults
          .filter((result) => result.status === "fulfilled")
          .flatMap((result) => result.value);

        setTasks(loadedTasks);
        setProjectMembers(
          memberResults
            .filter((result) => result.status === "fulfilled")
            .reduce((membersByProject, result) => {
              membersByProject[result.value.projectId] = result.value.members;
              return membersByProject;
            }, {}),
        );

        if (failedTaskRequests.length > 0) {
          setTasksError("Some project tasks could not be loaded");
        }
      } catch (error) {
        console.error("Failed to load dashboard projects:", error);
        if (isCurrent) {
          setProjectsError("Unable to load your projects");
          setProjects([]);
          setProjectMembers({});
          setTasks([]);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isCurrent = false;
    };
  }, [loading, navigate, user]);

  const taskSummary = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "done").length;
    const inProgress = tasks.filter(
      (task) => task.status === "in_progress",
    ).length;

    return {
      completed,
      inProgress,
      total: tasks.length,
    };
  }, [tasks]);

  const recentTasks = useMemo(
    () =>
      tasks
        .slice()
        .sort((firstTask, secondTask) => {
          const firstDate = new Date(
            firstTask.updatedAt || firstTask.createdAt || 0,
          ).getTime();
          const secondDate = new Date(
            secondTask.updatedAt || secondTask.createdAt || 0,
          ).getTime();

          return secondDate - firstDate;
        })
        .slice(0, 5),
    [tasks],
  );

  if (loading || isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#fafafa] md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 p-6 text-[#171717] sm:p-8">
        <div className="mx-auto max-w-[1180px]">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">
                Welcome back, {user?.fullName || user?.username || "there"}
              </h1>
              <p className="mt-2 text-sm text-[#4d4d4d]">
                Keep your projects moving and your team aligned.
              </p>
            </div>
          </header>

          {projectsError && (
            <p className="mt-6 rounded-md border border-[#f4cccc] bg-[#fff5f5] px-4 py-3 text-sm text-[#c50000]">
              {projectsError}
            </p>
          )}

          <section
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            aria-label="Workspace task summary"
          >
            {SUMMARY_CARDS.map(({ getValue, ...card }) => (
              <SummaryCard
                key={card.label}
                {...card}
                value={getValue(taskSummary, projects.length)}
              />
            ))}
          </section>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="overflow-hidden rounded-2xl border border-[#ebebeb] bg-[#fafafa] p-5">
              <SectionHeader title="Recent tasks" />
              {tasksError && (
                <p className="border-b border-[#f2f2f2] px-1 py-3 text-xs text-[#ab570a]">
                  {tasksError}
                </p>
              )}
              {recentTasks.length > 0 ? (
                <div className="max-h-[20rem] space-y-3 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {recentTasks.map((task) => (
                    <TaskItem
                      key={`${task.projectId}-${task._id}`}
                      task={task}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No tasks yet"
                  message="Tasks from your projects will appear here."
                />
              )}
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#ebebeb] bg-[#fafafa] p-5">
              <SectionHeader title="Your projects" />
              {projects.length > 0 ? (
                <div className="max-h-[20rem] space-y-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {projects.map(({ project, role }) => {
                    return (
                      <ProjectItem
                        key={project._id}
                        project={project}
                        role={role}
                        members={projectMembers[project._id] || []}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No projects yet"
                  message="Create a project to start organizing your work."
                />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

const SummaryCard = ({ icon, label, value, pill, pillClass }) => (
  <div className="min-h-[164px] rounded-2xl border border-[#ebebeb] bg-white px-6 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:px-7 sm:py-6">
    <p className="text-xs font-semibold uppercase tracking-wide text-[#8f9db2]">
      {label}
    </p>
    <strong className="mt-3 block text-3xl font-semibold leading-none tracking-tight text-[#171717]">
      {value}
    </strong>
    <span
      className={`mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${pillClass}`}
    >
      {icon}
      {pill}
    </span>
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="px-1 pb-4">
    <h2 className="text-sm font-semibold">{title}</h2>
  </div>
);

const TASK_STATUS_DOT_CLASSES = {
  done: "bg-green-500",
  in_progress: "bg-orange-500",
  todo: "bg-gray-500",
};

const TaskItem = ({ task }) => (
  <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#ebebeb] bg-white px-3 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
    {task.assignedBy?.avatar?.url ? (
      <img
        src={task.assignedBy.avatar.url}
        alt={`${getUserName(task.assignedBy)}'s profile`}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
    ) : (
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#171717] text-xs font-medium text-white"
        aria-hidden="true"
      >
        {getUserInitials(task.assignedBy)}
      </span>
    )}
    <div className="min-w-0 flex-1">
      <p className="flex min-w-0 items-center gap-2 truncate text-sm font-medium">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            TASK_STATUS_DOT_CLASSES[task.status] ||
            TASK_STATUS_DOT_CLASSES.todo
          }`}
          aria-label={`${task.status?.replace("_", " ") || "todo"} status`}
          title={task.status?.replace("_", " ") || "todo"}
        />
        <span className="truncate">{task.title}</span>
      </p>
      <p className="mt-0.5 flex min-w-0 items-center gap-1 truncate text-xs text-[#8f8f8f]">
        <BsArrowReturnRight
          className="h-3.5 w-3.5 shrink-0 text-[#4d4d4d]"
          aria-hidden="true"
        />
        <Link
          to={`/projects/${task.projectId}`}
          className="truncate hover:underline"
        >
          {task.projectName}
        </Link>
      </p>
    </div>
  </div>
);

const ProjectItem = ({ project, role, members }) => {
  const avatarUrls = members
    .map((member) => member.user?.avatar?.url)
    .filter(Boolean)
    .slice(0, 3);
  const memberCount = project.members || members.length;
  const remainingMembers = Math.max(memberCount - avatarUrls.length, 0);

  return (
    <Link
      to={`/projects/${project._id}`}
      className="flex items-center gap-4 rounded-xl border border-[#ebebeb] bg-white px-3 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#fafafa]"
    >
      <AvatarCircles
        avatarUrls={avatarUrls}
        numPeople={remainingMembers}
        className="w-31 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{project.name}</p>
      </div>
      <span className="rounded-full bg-[#f2f2f2] px-2.5 py-1 text-[11px] font-medium text-[#4d4d4d]">
        {roleLabel(role)}
      </span>
    </Link>
  );
};

const getUserName = (user) =>
  user?.fullName || user?.username || "Unknown user";

const getUserInitials = (user) =>
  getUserName(user)
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const EmptyState = ({ title, message }) => (
  <div className="px-4 py-10 text-center">
    <p className="text-sm font-medium">{title}</p>
    <p className="mt-1 text-xs text-[#8f8f8f]">{message}</p>
  </div>
);

export default Dashboard;
