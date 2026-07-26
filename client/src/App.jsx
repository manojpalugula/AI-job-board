import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BookmarkIcon, MagnifyingGlassIcon, MapPinIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { aiApi, applicationApi, authApi, apiMessage, jobApi, userApi } from './services/api';

const initialJobs = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'Arcade', location: 'Remote · India', type: 'Full-time', salary: '₹24–32L', skills: ['React', 'TypeScript', 'Design systems'], color: '#7c3aed' },
  { id: 2, title: 'Product Designer', company: 'Northstar', location: 'Bengaluru, India', type: 'Full-time', salary: '₹18–26L', skills: ['Figma', 'Research', 'Prototyping'], color: '#06b6d4' },
  { id: 3, title: 'Backend Engineer', company: 'Vertex Labs', location: 'Remote · APAC', type: 'Full-time', salary: '₹22–30L', skills: ['Node.js', 'MongoDB', 'APIs'], color: '#2563eb' },
  { id: 4, title: 'AI Engineer', company: 'Luma', location: 'Mumbai, India', type: 'Hybrid', salary: '₹28–38L', skills: ['Python', 'LLMs', 'MLOps'], color: '#10b981' },
  { id: 5, title: 'Staff Mobile Engineer', company: 'Pulse', location: 'Remote · India', type: 'Full-time', salary: '₹26–34L', skills: ['React Native', 'Mobile UX', 'Growth'], color: '#f59e0b' },
  { id: 6, title: 'DevOps Engineer', company: 'BrightPath', location: 'Pune, India', type: 'Full-time', salary: '₹20–28L', skills: ['Docker', 'CI/CD', 'AWS'], color: '#ef4444' }
];

const skillOptions = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Figma', 'MongoDB', 'Docker', 'CI/CD', 'Next.js', 'UX research', 'Product strategy', 'LLMs', 'Data pipelines', 'React Native'];

const stats = [{ name: 'Jan', v: 18 }, { name: 'Feb', v: 27 }, { name: 'Mar', v: 22 }, { name: 'Apr', v: 38 }, { name: 'May', v: 44 }, { name: 'Jun', v: 51 }];

function Logo() {
  return <Link className="logo" to="/"><span>◈</span> orbit<span className="dot">.</span></Link>;
}

function formatSalary(job) {
  if (typeof job.salary === 'string') return job.salary;
  if (job.salary?.min && job.salary?.max) {
    const min = Math.round(job.salary.min / 100000);
    const max = Math.round(job.salary.max / 100000);
    return `₹${min}–${max}L`;
  }
  return 'Competitive';
}

function Header({ user, onLogout }) {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  return (
    <header>
      <Logo />
      <nav>
        {!user || user.role === 'candidate' ? <NavLink to="/jobs">Find work</NavLink> : null}
        {user && user.role === 'candidate' && <NavLink to="/profile">Profile</NavLink>}
        {user && (user.role === 'recruiter' || user.role === 'admin') && <>
          <NavLink to="/dashboard">For teams</NavLink>
          <NavLink to="/candidates">Candidates</NavLink>
          <NavLink to="/create-job">Post role</NavLink>
        </>}
        {user && user.role === 'candidate' && <NavLink to="/saved">Saved</NavLink>}
      </nav>
      <div className="header-actions">
        <button className="icon-btn" aria-label="toggle theme" onClick={() => setDark(!dark)}>{dark ? '☼' : '◐'}</button>
        {user ? (
          <>
            <span className="signin">Hi, {user.name}</span>
            <button className="button small" onClick={onLogout}>Sign out</button>
          </>
        ) : (
          <>
            <Link className="signin" to="/login">Sign in</Link>
            <Link className="button small" to="/register">Get started →</Link>
          </>
        )}
      </div>
    </header>
  );
}

function JobCard({ job, user }) {
  const routeId = job._id || job.id;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('orbit_saved_jobs') || '[]');
    setSaved(savedJobs.includes(String(routeId)));
  }, [routeId]);

  const toggleSaved = () => {
    const savedJobs = JSON.parse(localStorage.getItem('orbit_saved_jobs') || '[]');
    const next = new Set(savedJobs.map(String));
    if (next.has(String(routeId))) {
      next.delete(String(routeId));
      toast.success('Removed from saved jobs');
    } else {
      next.add(String(routeId));
      toast.success('Saved for later');
    }
    const savedArray = Array.from(next);
    localStorage.setItem('orbit_saved_jobs', JSON.stringify(savedArray));
    setSaved(next.has(String(routeId)));
  };

  return (
    <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }} className="job-card">
      <div className="job-top">
        <div className="company-mark" style={{ background: job.color || '#7c3aed' }}>{(job.company || 'O')[0]}</div>
        {user?.role !== 'recruiter' && user?.role !== 'admin' && <button className={'save ' + (saved ? 'saved' : '')} onClick={toggleSaved}><BookmarkIcon /></button>}
      </div>
      <h3>{job.title}</h3>
      <p className="company">{job.company}</p>
      <p className="meta"><MapPinIcon />{job.location}</p>
      <div className="pills"><span>{job.employmentType || job.type || 'Full-time'}</span><span>{formatSalary(job)}</span></div>
      <div className="skills">{(job.skills || []).map((s) => <b key={s}>{s}</b>)}</div>
      {user?.role === 'recruiter' || user?.role === 'admin' ? <Link to="/dashboard" className="apply">Manage roles <span>→</span></Link> : <Link to={'/jobs/' + routeId} className="apply">View opportunity <span>→</span></Link>}
    </motion.article>
  );
}

function Landing({ user, jobs }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const featuredJobs = jobs?.length ? jobs.slice(0, 4) : initialJobs.slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="orb one" />
        <div className="orb two" />
        <div className="hero-copy">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow"><SparklesIcon /> The intelligent career network</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>Find work that<br /><em>moves you forward.</em></motion.h1>
          <p className="lede">Match with exceptional teams, not just static listings. Orbit uses AI to surface the right opportunities and helps recruiters move faster.</p>
          <form className="search" onSubmit={(e) => { e.preventDefault(); navigate('/jobs?q=' + q); }}>
            <MagnifyingGlassIcon />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title, skill, or company" />
            <button className="button">Explore jobs <span>→</span></button>
          </form>
          <div className="trusted">
            <span>TRUSTED BY TEAMS AT</span><b>luma</b><b>northstar</b><b>Arcade</b><b>vertex</b>
          </div>
        </div>
        <div className="hero-panel">
          <div className="signal"><span className="pulse" />YOUR NEXT MOVE <i>Live matches</i></div>
          <div className="match-card">
            <div className="match-head"><div className="company-mark gradient">A</div><div><b>Arcade</b><small>Designing play, together</small></div><span className="match">94% match</span></div>
            <h3>Senior Frontend Engineer</h3>
            <p>Remote · Full-time · ₹24–32L</p>
            <div className="fit"><span>Why you’re a fit</span><b>React</b><b>TypeScript</b><b>Design systems</b></div>
            <button className="button full" onClick={() => navigate('/jobs/1')}>See your match <span>→</span></button>
          </div>
          <div className="floating-review">“The first job platform that<br />actually gets it.” <b>— Priya, Product Designer</b></div>
        </div>
      </section>
      <section className="featured">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FOR {user?.role === 'recruiter' || user?.role === 'admin' ? 'RECRUITERS' : 'CANDIDATES'}</p>
            <h2>{user?.role === 'recruiter' || user?.role === 'admin' ? 'A smarter hiring workspace.' : 'Opportunities worth your attention.'}</h2>
          </div>
          <Link to={user?.role === 'recruiter' || user?.role === 'admin' ? '/dashboard' : '/jobs'}>{user?.role === 'recruiter' || user?.role === 'admin' ? 'Open dashboard →' : 'View all jobs →'}</Link>
        </div>
        <div className="job-grid">{featuredJobs.map((job) => <JobCard key={job._id || job.id} job={job} user={user} />)}</div>
      </section>
    </>
  );
}

function Jobs({ jobs, jobsLoading, user }) {
  const [query, setQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('Anywhere');
  const [typeFilter, setTypeFilter] = useState('All roles');
  const [showFilters, setShowFilters] = useState(true);
  const sourceJobs = jobs?.length ? jobs : initialJobs;
  const shown = sourceJobs.filter((job) => {
    const text = (job.title + ' ' + job.company + ' ' + (job.skills || []).join(' ')).toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const isRemote = job.location?.toLowerCase().includes('remote');
    const matchesLocation =
      locationFilter === 'Anywhere' ||
      (locationFilter === 'Remote' ? isRemote : !isRemote);
    const matchesType =
      typeFilter === 'All roles' ||
      (job.employmentType || job.type || '').toLowerCase() === typeFilter.toLowerCase();
    return matchesQuery && matchesLocation && matchesType;
  });

  return (
    <main className="page">
      <div className="page-intro">
        <p className="eyebrow">DISCOVER</p>
        <h1>Work with people<br /><em>who raise your bar.</em></h1>
        <div className="filter"><MagnifyingGlassIcon /><input autoFocus placeholder="Search opportunities" value={query} onChange={(e) => setQuery(e.target.value)} /><button onClick={() => setShowFilters(!showFilters)}>Filters</button></div>
      </div>
      <div className="results">
        <aside style={{display: showFilters ? 'block' : 'none'}}>
          <b>Refine results</b>
          <label>Location<select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}><option>Anywhere</option><option>Remote</option><option>On-site</option></select></label>
          <label>Job type<select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option>All roles</option><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></label>
        </aside>
        <section>
          <div className="result-head"><p><b>{shown.length} roles</b> matched your search</p><select><option>Most relevant</option><option>Newest first</option></select></div>
          {jobsLoading ? <div className="empty">Loading live opportunities…</div> : <div className="list">{shown.map((job) => <JobCard key={job._id || job.id} job={job} user={user} />)}</div>}
          {!shown.length && !jobsLoading && <div className="empty">No roles match that search. Try a skill or company name.</div>}
        </section>
      </div>
    </main>
  );
}

function JobDetail({ jobs, user }) {
  const [applied, setApplied] = useState(false);
  const { id } = useParams();
  const sourceJobs = jobs?.length ? jobs : initialJobs;
  const job = sourceJobs.find((item) => String(item._id || item.id) === String(id)) || sourceJobs[0] || initialJobs[0];

  return (
    <main className="page detail">
      <Link to="/jobs" className="back">← All opportunities</Link>
      <div className="detail-grid">
        <article>
          <div className="job-top"><div className="company-mark gradient">A</div><span className="open">● Actively hiring</span></div>
          <h1>{job.title}</h1>
          <p className="company big">{job.company} · {job.location} · {job.employmentType || job.type || 'Full-time'}</p>
          <div className="detail-copy">
            <h2>Build the future of play.</h2>
            <p>{job.description || 'Arcade is creating joyful tools for creative teams. We’re looking for a thoughtful person who cares as much about the feeling of a product as its performance.'}</p>
            <h3>What you’ll do</h3>
            <ul><li>Craft fast, expressive interfaces used by teams around the world.</li><li>Shape our component system alongside product and design partners.</li><li>Raise the bar for accessibility, performance, and engineering craft.</li></ul>
            <h3>What you’ll bring</h3>
            <p>Two or more years building with React and TypeScript, a sharp product instinct, and kindness in collaboration.</p>
          </div>
        </article>
        <aside className="apply-box">
          <span className="match">94% match</span>
          <h3>This could be a great fit.</h3>
          <p>Your experience lines up strongly with this role.</p>
          {user?.role === 'candidate' ? <>
            <button className="button full" onClick={async () => { try { await applicationApi.apply(job._id || job.id); setApplied(true); toast.success('Application submitted — good luck!'); } catch (error) { toast.error(apiMessage(error)); } }}>{applied ? 'Application submitted ✓' : 'Apply now →'}</button>
            <button className="text-button"><BookmarkIcon /> Save for later</button>
          </> : <p className="muted">Sign in as a candidate to apply for this role.</p>}
        </aside>
      </div>
    </main>
  );
}

function Dashboard({ user }) {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobApi.mine().then((response) => setMyJobs(response.data.jobs || [])).catch((error) => toast.error(apiMessage(error))).finally(() => setLoading(false));
  }, []);

  const totalApplicants = myJobs.reduce((sum, job) => sum + (job.applicantCount || 0), 0);
  const companies = new Set(myJobs.map((job) => job.company)).size;
  const statsCards = [
    { label: 'My open roles', value: String(myJobs.length), change: 'Roles you have posted' },
    { label: 'Total applicants', value: String(totalApplicants), change: 'Across your roles' },
    { label: 'Companies posting', value: String(companies), change: 'Company data on your board' },
    { label: 'Candidate pool', value: 'Browse', change: 'Review all candidates' }
  ];

  return (
    <main className="page dashboard">
      <p className="eyebrow">RECRUITER OVERVIEW</p>
      <h1>Good morning, {user?.name || 'Aisha'} <span>✦</span></h1>
      <p className="muted">Here’s how your hiring pipeline is moving this week.</p>
      <div className="metrics">{statsCards.map((card) => <div key={card.label}><small>{card.label}</small><b>{card.value}</b><em>{card.change}</em></div>)}</div>
      <div className="dash-grid">
        <section className="chart-card">
          <div><h3>Pipeline momentum</h3><p>Qualified applications over time</p></div>
          <ResponsiveContainer width="100%" height={245}><AreaChart data={stats}><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#7c3aed" stopOpacity="0.38" /><stop offset="1" stopColor="#7c3aed" stopOpacity="0" /></linearGradient></defs><Tooltip /><Area type="monotone" dataKey="v" stroke="#9b7cff" strokeWidth="3" fill="url(#fill)" /></AreaChart></ResponsiveContainer>
        </section>
        <section className="chart-card ai">
          <p className="eyebrow"><SparklesIcon /> ROLE BUILDER</p>
          <h3>Make your job post sharper.</h3>
          <p>Draft an opportunity that attracts candidates and publish it directly to your board.</p>
          <Link className="button full" to="/create-job">Open role builder →</Link>
        </section>
      </div>
      <section className="chart-card applicants">
        <div className="section-heading"><div><h3>My active roles</h3><p>Each role keeps its own applicant list and count.</p></div><Link to="/create-job">Post a role →</Link></div>
        {loading ? <div className="empty">Loading your roles…</div> : myJobs.length ? myJobs.map((job) => <div className="applicant" key={job._id || job.id}><span className="avatar">{(job.company || 'O')[0]}</span><b>{job.title}</b><span>{job.company} · {job.applicantCount || 0} applicant{job.applicantCount === 1 ? '' : 's'}</span><Link to={'/dashboard/jobs/' + (job._id || job.id) + '/applicants'}>View applicants →</Link></div>) : <div className="empty">You have not posted a role yet. Create one to begin receiving applicants.</div>}
      </section>
    </main>
  );
}

function JobApplicants() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => applicationApi.forJob(id).then((response) => setData(response.data)).catch((error) => toast.error(apiMessage(error))).finally(() => setLoading(false));
  useEffect(() => { load(); }, [id]);

  async function changeStatus(applicationId, status) {
    try {
      await applicationApi.updateStatus(applicationId, status);
      toast.success('Candidate status updated');
      load();
    } catch (error) { toast.error(apiMessage(error)); }
  }

  return <main className="page candidates">
    <Link to="/dashboard" className="back">← My roles</Link>
    <p className="eyebrow">APPLICANTS BY ROLE</p>
    <h1>{data?.job?.title || 'Applicants'}</h1>
    <p className="muted">{data?.job?.company || 'Your company'} · {data?.applications?.length || 0} applicant{data?.applications?.length === 1 ? '' : 's'}</p>
    {loading ? <div className="empty">Loading applicants…</div> : data?.applications?.length ? <div className="list">{data.applications.map((application) => <article key={application._id} className="job-card"><div className="job-top"><div className="company-mark" style={{ background: '#10b981' }}>{(application.candidate?.name || 'C')[0]}</div><span className="role-pill">{application.status}</span></div><h3>{application.candidate?.name}</h3><p className="company">{application.candidate?.email}</p><div className="skills">{(application.candidate?.skills || []).map((skill) => <b key={skill}>{skill}</b>)}</div><label>Application status<select value={application.status} onChange={(event) => changeStatus(application._id, event.target.value)}><option value="submitted">Submitted</option><option value="reviewing">Reviewing</option><option value="interview">Interview</option><option value="offered">Offered</option><option value="rejected">Rejected</option></select></label></article>)}</div> : <div className="empty">No one has applied for this role yet.</div>}
  </main>;
}

function SavedJobs({ jobs }) {
  const savedIds = JSON.parse(localStorage.getItem('orbit_saved_jobs') || '[]');
  const sourceJobs = jobs?.length ? jobs : initialJobs;
  const savedJobs = sourceJobs.filter((job) => savedIds.includes(String(job._id || job.id)));

  return (
    <main className="page">
      <p className="eyebrow">SAVED</p>
      <h1>Your shortlist</h1>
      <p className="muted">Keep track of roles you want to come back to.</p>
      <div className="list">
        {savedJobs.length ? savedJobs.map((job) => <JobCard key={job._id || job.id} job={job} />) : <div className="empty">No saved roles yet. Browse the board and save the ones you like.</div>}
      </div>
    </main>
  );
}

function Profile({ user, onProfileUpdated }) {
  const [profile, setProfile] = useState(user);
  const [skills, setSkills] = useState(user?.skills || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await userApi.me();
        setProfile(response.data);
        setSkills(response.data.skills || []);
        onProfileUpdated?.(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    if (user) fetchProfile();
  }, [user, onProfileUpdated]);

  const toggleSkill = (skill) => {
    setSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    );
  };

  async function saveProfile() {
    setLoading(true);
    try {
      const response = await userApi.updateProfile({ skills });
      setProfile(response.data);
      onProfileUpdated?.(response.data);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(apiMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page profile">
      <p className="eyebrow">PROFILE</p>
      <h1>{profile?.name || 'Your profile'}</h1>
      <p className="muted">Update your skills and see who has selected you.</p>
      <section className="profile-card">
        <div className="detail-copy">
          <h3>Your role</h3>
          <p>{profile?.role}</p>
          <h3>Your skills</h3>
          <div className="pill-row">
            {skillOptions.map((skill) => (
              <button
                key={skill}
                type="button"
                className={`pill ${skills.includes(skill) ? 'active' : ''}`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
          <button className="button full" onClick={saveProfile} disabled={loading}>{loading ? 'Saving…' : 'Save skills'}</button>
        </div>
        {profile?.selectedBy?.length ? (
          <aside className="section-heading">
            <div><h3>Selected by</h3><p>Recruiters who marked you as a strong candidate.</p></div>
            <div className="selected-list">{profile.selectedBy.map((recruiter) => <div key={recruiter._id || recruiter.id} className="applicant"><span className="avatar">{(recruiter.name || 'R')[0]}</span><b>{recruiter.name}</b><span>{recruiter.role}</span></div>)}</div>
          </aside>
        ) : (
          <aside className="empty">No recruiters have selected you yet.</aside>
        )}
      </section>
    </main>
  );
}

function Candidates({ user }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMap, setSelectedMap] = useState({});

  useEffect(() => {
    async function loadCandidates() {
      try {
        const response = await userApi.list({ role: 'candidate' });
        setCandidates(response.data.users);
        const current = {};
        response.data.users.forEach((candidate) => {
          current[candidate._id || candidate.id] = candidate.selectedBy?.some((recruiter) => recruiter._id === user.id || recruiter.id === user.id);
        });
        setSelectedMap(current);
      } catch (error) {
        toast.error(apiMessage(error));
      } finally {
        setLoading(false);
      }
    }
    if (user) loadCandidates();
  }, [user]);

  async function selectCandidate(candidateId) {
    try {
      const response = await userApi.selectCandidate(candidateId);
      setCandidates((prev) => prev.map((candidate) => candidate._id === candidateId || candidate.id === candidateId ? response.data : candidate));
      setSelectedMap((prev) => ({ ...prev, [candidateId]: true }));
      toast.success('Candidate selected');
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <main className="page candidates">
      <p className="eyebrow">CANDIDATES</p>
      <h1>Review candidates</h1>
      <p className="muted">Select the candidates you want to track from this list.</p>
      {loading ? <div className="empty">Loading candidates…</div> : (
        <div className="list">
          {candidates.map((candidate) => (
            <article key={candidate._id || candidate.id} className="job-card">
              <div className="job-top">
                <div className="company-mark" style={{ background: '#10b981' }}>{(candidate.name || 'C')[0]}</div>
                <span className="role-pill">{candidate.role}</span>
              </div>
              <h3>{candidate.name}</h3>
              <div className="skills">{(candidate.skills || []).map((skill) => <b key={skill}>{skill}</b>)}</div>
              <button className={`button ${selectedMap[candidate._id || candidate.id] ? 'outline' : ''}`} onClick={() => selectCandidate(candidate._id || candidate.id)}>{selectedMap[candidate._id || candidate.id] ? 'Selected' : 'Select candidate'}</button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function CreateJob({ user, onCreated }) {
  const [brief, setBrief] = useState('We need a React developer with 2 years experience.');
  const [generated, setGenerated] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('Orbit');
  const [location, setLocation] = useState('Remote · India');
  const [employmentType, setEmploymentType] = useState('full-time');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const response = await aiApi.generate(brief);
      setTitle(response.data.title || 'Software Engineer');
      setSkills(response.data.skills || ['React', 'JavaScript']);
      setDescription(response.data.description || 'Write a compelling description for this role.');
      setGenerated(`Title: ${response.data.title || 'Software Engineer'}\n\nAbout the role\n${response.data.description || ''}\n\nSuggested skills: ${response.data.skills?.join(', ') || ''}`);
      toast.success('Draft generated with Orbit AI');
    } catch {
      toast.error('Unable to generate draft right now.');
    } finally {
      setLoading(false);
    }
  }

  async function publishDraft() {
    if (!title.trim() || !description.trim()) {
      toast.error('Enter a title and description before publishing.');
      return;
    }
    if (!user || (user.role !== 'recruiter' && user.role !== 'admin')) {
      toast.error('Please sign in as a recruiter to publish this role.');
      return;
    }
    try {
      await jobApi.create({
        title: title.trim(),
        company: company.trim() || 'Orbit',
        description: description.trim(),
        location: location.trim() || 'Remote · India',
        employmentType,
        skills,
        salary: { min: 1800000, max: 2600000, currency: 'INR' }
      });
      toast.success('Role published to the board');
      onCreated?.();
      setTitle('');
      setDescription('');
      setGenerated('');
      setSkills([]);
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  const toggleSkill = (skill) => {
    setSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    );
  };

  return (
    <main className="page create">
      <p className="eyebrow">NEW OPPORTUNITY</p>
      <h1>Write a role people<br /><em>want to say yes to.</em></h1>
      <div className="writer">
        <section>
          <label>Job title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior Frontend Engineer" /></label>
          <label>Company<input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Orbit" /></label>
          <label>Location<input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote · India" /></label>
          <label>Employment type<select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option><option value="internship">Internship</option></select></label>
          <label>Role brief<textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Describe the role in one or two sentences." /></label>
          <button className="button" onClick={generate} disabled={loading}>{loading ? 'Generating…' : <><SparklesIcon /> Generate with AI</>}</button>
          <label>Role description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write the role description here." rows={8} /></label>
          <div>
            <p>Select skills</p>
            <div className="pill-row">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className={`pill ${skills.includes(skill) ? 'active' : ''}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <button className="button full" onClick={publishDraft}>{title && description ? 'Publish to board →' : 'Fill title and description to publish'}</button>
        </section>
        <section className="output">
          <p className="eyebrow">AI DRAFT</p>
          {generated ? <pre>{generated}</pre> : <div className="empty"><SparklesIcon /> Use the draft generator to auto-fill the description and suggested skills.</div>}
          {title ? <div className="match-card"><b>Suggested title</b><h3>{title}</h3></div> : null}
        </section>
      </div>
    </main>
  );
}

function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = JSON.parse(localStorage.getItem('orbit_user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles.length && !allowedRoles.includes(user.role)) return <Navigate to="/jobs" replace />;
  return children;
}

function Auth({ user, onAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname === '/register';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate', skills: [] });
  const [loading, setLoading] = useState(false);
  const passwordHint = form.password.length > 0 && form.password.length < 8 ? 'Use at least 8 characters.' : form.password.length >= 8 ? 'Looks good.' : ' ';

  useEffect(() => {
    if (user) navigate(user.role === 'recruiter' || user.role === 'admin' ? '/dashboard' : '/jobs', { replace: true });
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister && form.password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
    setLoading(true);
    try {
      const payload = isRegister ? { name: form.name, email: form.email, password: form.password, role: form.role, skills: form.skills } : { email: form.email, password: form.password };
      const res = await (isRegister ? authApi.register(payload) : authApi.login(payload));
      localStorage.setItem('orbit_token', res.data.token);
      localStorage.setItem('orbit_user', JSON.stringify(res.data.user));
      onAuthenticated(res.data.user);
      toast.success(isRegister ? 'Account created successfully' : 'Signed in successfully');
      navigate(res.data.user.role === 'recruiter' || res.data.user.role === 'admin' ? '/dashboard' : '/jobs');
    } catch (error) {
      toast.error(apiMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <Logo />
      <section>
        <p className="eyebrow">{isRegister ? 'CREATE ACCOUNT' : 'WELCOME BACK'}</p>
        <h1>{isRegister ? 'Start your next<br /><em>chapter.</em>' : 'Find your next<br /><em>great thing.</em>'}</h1>
        <p>{isRegister ? 'Create an account to discover jobs and manage opportunities.' : 'Sign in to pick up where you left off.'}</p>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <label>Email<input type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          {isRegister && <>
            <label>Name<input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value, skills: [] })}><option value="candidate">Candidate</option><option value="recruiter">Recruiter</option></select></label>
            <div>
              <p>Select skills to show in your profile</p>
              <div className="pill-row">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={`pill ${form.skills.includes(skill) ? 'active' : ''}`}
                    onClick={() => {
                      const nextSkills = form.skills.includes(skill)
                        ? form.skills.filter((item) => item !== skill)
                        : [...form.skills, skill];
                      setForm({ ...form, skills: nextSkills });
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </>}
          <label>Password<input type="password" required placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          {isRegister && <small style={{ color: form.password.length >= 8 ? '#62d5b4' : '#f7b267' }}>{passwordHint}</small>}
          <button className="button full" type="submit" disabled={loading}>{loading ? (isRegister ? 'Creating account...' : 'Signing in...') : (isRegister ? 'Create account →' : 'Sign in →')}</button>
        </form>
        <p>{isRegister ? 'Already have an account? ' : 'New to Orbit? '}<Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
      </section>
    </main>
  );
}

function App() {
  const [authUser, setAuthUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('orbit_user') || 'null'); } catch { return null; }
  });
  const [jobs, setJobs] = useState(initialJobs);
  const [jobsLoading, setJobsLoading] = useState(true);

  const refreshJobs = async () => {
    setJobsLoading(true);
    try {
      const response = await jobApi.list({ limit: 12 });
      setJobs(response.data.jobs?.length ? response.data.jobs : initialJobs);
    } catch {
      setJobs(initialJobs);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => { refreshJobs(); }, []);

  const handleAuthenticated = (user) => {
    setAuthUser(user);
    localStorage.setItem('orbit_user', JSON.stringify(user));
  };

  const handleProfileUpdated = (user) => {
    setAuthUser(user);
    localStorage.setItem('orbit_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('orbit_token');
    localStorage.removeItem('orbit_user');
    setAuthUser(null);
  };

  return (
    <>
      <Header user={authUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing user={authUser} jobs={jobs} />} />
        <Route path="/jobs" element={<Jobs jobs={jobs} jobsLoading={jobsLoading} user={authUser} />} />
        <Route path="/jobs/:id" element={<JobDetail jobs={jobs} user={authUser} />} />
        <Route path="/saved" element={<SavedJobs jobs={jobs} />} />
        <Route path="/profile" element={<ProtectedRoute><Profile user={authUser} onProfileUpdated={handleProfileUpdated} /></ProtectedRoute>} />
        <Route path="/candidates" element={<ProtectedRoute allowedRoles={['recruiter', 'admin']}><Candidates user={authUser} /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['recruiter', 'admin']}><Dashboard user={authUser} /></ProtectedRoute>} />
        <Route path="/dashboard/jobs/:id/applicants" element={<ProtectedRoute allowedRoles={['recruiter', 'admin']}><JobApplicants /></ProtectedRoute>} />
        <Route path="/create-job" element={<ProtectedRoute allowedRoles={['recruiter', 'admin']}><CreateJob user={authUser} onCreated={refreshJobs} /></ProtectedRoute>} />
        <Route path="/login" element={<Auth user={authUser} onAuthenticated={handleAuthenticated} />} />
        <Route path="/register" element={<Auth user={authUser} onAuthenticated={handleAuthenticated} />} />
        <Route path="*" element={<Jobs jobs={jobs} jobsLoading={jobsLoading} user={authUser} />} />
      </Routes>
      <footer><Logo /><p>© 2026 Orbit, Inc. Built for meaningful work.</p><div>Privacy · Terms · Contact</div></footer>
    </>
  );
}

export default App;
