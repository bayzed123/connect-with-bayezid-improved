# Connect With Bayezid - Professional Website Template

A modern, production-ready full-stack web application template built with React 19, Express, tRPC, and Tailwind CSS. Perfect for digital agencies, freelancers, and service providers.

## 🚀 Features

### Frontend
- **React 19** with TypeScript for type-safe development
- **Tailwind CSS 4** for responsive, utility-first styling
- **shadcn/ui** components for professional UI elements
- **Wouter** for lightweight client-side routing
- **Framer Motion** for smooth animations
- **Responsive Design** - Mobile-first approach with full responsiveness

### Backend
- **Express 4** server with tRPC for end-to-end type safety
- **Drizzle ORM** for database management
- **MySQL/TiDB** database support
- **OAuth 2.0** authentication integration
- **File Storage** with AWS S3 support
- **Email Notifications** system

### Features
- 📝 **Blog System** - Create, manage, and publish blog posts
- 💬 **Comments** - Auto-approved reader comments
- 📱 **Social Sharing** - Facebook, Twitter, LinkedIn, WhatsApp integration
- 💰 **AdSense Monetization** - Built-in ad placement support
- 📊 **Analytics** - Visitor tracking and page analytics
- 🛍️ **Products & Orders** - E-commerce functionality
- 👥 **User Management** - Role-based access control
- 📧 **Newsletter** - Email subscription system
- 🔐 **Admin Dashboard** - Comprehensive management interface

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v10 or higher) - Package manager
- **MySQL/TiDB** database
- **Git** for version control

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd connect-with-bayezid-improved
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=mysql://username:password@localhost:3306/database_name

# OAuth & Authentication
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://oauth.example.com
VITE_OAUTH_PORTAL_URL=https://login.example.com
JWT_SECRET=your_jwt_secret_key

# Owner Information
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id

# Manus APIs (if using Manus platform)
BUILT_IN_FORGE_API_URL=https://api.example.com
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.example.com
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# App Configuration
VITE_APP_TITLE=Your Website Title
VITE_APP_LOGO=https://your-cdn.com/logo.png
```

### 4. Setup Database

Initialize the database schema and run migrations:

```bash
pnpm db:push
```

This command will:
- Generate database migrations
- Apply all pending migrations
- Create necessary tables and relationships

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📦 Build & Deployment

### Build for Production

```bash
pnpm build
```

This creates:
- Optimized React frontend bundle in `dist/`
- Compiled Express server in `dist/index.js`

### Start Production Server

```bash
pnpm start
```

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Tests are written with Vitest and include:
- Backend API tests
- Database operation tests
- Feature integration tests

## 📁 Project Structure

```
.
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # Utilities and helpers
│   │   ├── hooks/            # Custom React hooks
│   │   └── App.tsx           # Main app component
│   ├── public/               # Static assets
│   └── index.html            # HTML entry point
│
├── server/                    # Express backend
│   ├── _core/                # Core infrastructure
│   │   ├── context.ts        # Request context
│   │   ├── oauth.ts          # OAuth handling
│   │   ├── llm.ts            # LLM integration
│   │   ├── notification.ts   # Notifications
│   │   └── trpc.ts           # tRPC setup
│   ├── routers.ts            # API procedures
│   ├── db.ts                 # Database queries
│   └── storage.ts            # File storage
│
├── drizzle/                   # Database schema
│   ├── schema.ts             # Table definitions
│   ├── relations.ts          # Table relationships
│   └── migrations/           # Migration files
│
├── shared/                    # Shared code
│   ├── types.ts              # Shared types
│   └── const.ts              # Constants
│
├── package.json              # Dependencies
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
└── drizzle.config.ts         # Drizzle config
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm test` | Run test suite |
| `pnpm check` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |
| `pnpm db:push` | Apply database migrations |

## 🎨 Customization

### Update Website Title & Logo

Edit `.env`:
```env
VITE_APP_TITLE=Your Company Name
VITE_APP_LOGO=https://your-cdn.com/logo.png
```

### Customize Theme

Edit `client/src/index.css` to modify:
- Color palette (CSS variables)
- Typography
- Spacing system
- Border radius
- Shadows

### Add New Pages

1. Create component in `client/src/pages/YourPage.tsx`
2. Add route in `client/src/App.tsx`
3. Add navigation link in `client/src/components/Header.tsx`

### Add New API Endpoints

1. Create procedure in `server/routers.ts`
2. Use `publicProcedure` or `protectedProcedure`
3. Call from frontend using `trpc.yourRouter.yourProcedure`

## 📚 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS, Vite |
| Backend | Express 4, tRPC 11, Node.js |
| Database | MySQL/TiDB, Drizzle ORM |
| Authentication | OAuth 2.0, JWT |
| File Storage | AWS S3 |
| Testing | Vitest |
| UI Components | shadcn/ui, Radix UI |
| Styling | Tailwind CSS 4 |
| Routing | Wouter (frontend), Express (backend) |

## 🔐 Security Considerations

- **Environment Variables**: Never commit `.env` files to version control
- **API Keys**: Keep all API keys and secrets in environment variables
- **Database**: Use strong passwords and enable SSL connections
- **Authentication**: Implement proper OAuth 2.0 flow
- **CORS**: Configure CORS properly for your domain
- **Rate Limiting**: Implement rate limiting on API endpoints
- **Input Validation**: Always validate user input on both frontend and backend

## 🚀 Deployment

### Deploy to Vercel

```bash
vercel deploy
```

### Deploy to Railway

```bash
railway deploy
```

### Deploy to Render

```bash
render deploy
```

### Docker Deployment

```bash
docker build -t your-app .
docker run -p 3000:3000 your-app
```

## 📖 Documentation

- [Frontend Development Guide](./docs/frontend.md)
- [Backend API Documentation](./docs/backend.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

- Verify `DATABASE_URL` in `.env`
- Ensure MySQL/TiDB server is running
- Check database credentials and permissions

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### TypeScript Errors

```bash
pnpm check
```

## 📞 Support

For issues and questions:
- Check existing documentation
- Review test files for usage examples
- Consult the project's issue tracker

## 📝 License

This project is licensed under a Proprietary Commercial License. See [LICENSE](./LICENSE) file for details.

## 🙏 Credits

Built with modern web technologies and best practices for professional development.

---

<div class="gravatar-hovercard"><style></style>
			<div class="gravatar-hovercard__inner">
				<div class="gravatar-hovercard__header-image" style="background: url(&quot;https://1.gravatar.com/userimage/282426431/b6da5f2ff34fca7891128d9f99ca712d?size=1024&quot;) 41% 34% / 39% auto repeat;"></div>
				<div class="gravatar-hovercard__header">
					<a class="gravatar-hovercard__avatar-link" href="https://gravatar.com/sayadbayezid?utm_source=hovercard" target="_blank">
						<img class="gravatar-hovercard__avatar" src="https://1.gravatar.com/avatar/c61a5642ead98ede5c16888f625d9884982e7a0ee8b9aa81a351e0294ab2664d?s=256&amp;d=initials" width="104" height="104" alt="Sayad Md Bayezid Hosan">
					</a>
					<a class="gravatar-hovercard__personal-info-link" href="https://gravatar.com/sayadbayezid?utm_source=hovercard" target="_blank">
						<h4 class="gravatar-hovercard__name">Sayad Md Bayezid Hosan</h4>
						<p class="gravatar-hovercard__job">Developer, ConnectwithBayezid</p>
						<p class="gravatar-hovercard__location">Bangladesh</p>
					</a>
				</div>
				<div class="gravatar-hovercard__body">
								<p class="gravatar-hovercard__description">Full-stack Web Developer, Digital Marketer, and Web Designer based in Bangladesh,  innovative digital ecosystem solutions and AI integration.
As a Full-stack Web Developer, Digital Marketer, and Web Designer, I have built a reputation for delivering innovative digital solutions with 5+ years of experience. My expertise spans the entire digital ecosystem, from web development and AI integration to strategic digital marketing and tech entrepreneurship.

As a leading Tech Provider, I specialize in permission-based technical solutions and managing digital business assets. I am dedicated to helping my audience navigate digital platforms safely and efficiently by combining academic knowledge with practical technical innovation</p>

</div>
				<div class="gravatar-hovercard__social-links">
					<a class="gravatar-hovercard__social-link" href="https://gravatar.com/sayadbayezid?utm_source=hovercard" target="_blank" data-service-name="gravatar">
						<img class="gravatar-hovercard__social-icon" src="https://s.gravatar.com/icons/gravatar.svg" width="32" height="32" alt="Gravatar">
					</a>
					
<a class="gravatar-hovercard__social-link" href="https://www.linkedin.com/in/sayadbayezid" target="_blank" data-service-name="linkedin">
						<img class="gravatar-hovercard__social-icon" src="https://s.gravatar.com/icons/linkedin.svg" width="32" height="32" alt="LinkedIn">
					</a>
				
<a class="gravatar-hovercard__social-link" href="https://github.com/Sayadbayezid" target="_blank" data-service-name="github">
						<img class="gravatar-hovercard__social-icon" src="https://s.gravatar.com/icons/github.svg" width="32" height="32" alt="GitHub">
					</a>
				
<a class="gravatar-hovercard__social-link" href="https://gitlab.com/Sayadbayezid" target="_blank" data-service-name="gitlab">
						<img class="gravatar-hovercard__social-icon" src="https://s.gravatar.com/icons/gitlab.svg" width="32" height="32" alt="GitLab">
					</a>
				
</div>
				
<div class="gravatar-hovercard__buttons">
					<button class="gravatar-hovercard__button" data-target-drawer="contact">Contact</button>
				
<button class="gravatar-hovercard__button" data-target-drawer="send-money">Send money</button>
</div>
			
<div class="gravatar-hovercard__footer">
					<a class="gravatar-hovercard__profile-url" title="https://gravatar.com/sayadbayezid" href="https://gravatar.com/sayadbayezid?utm_source=profile-card" target="_blank">
						gravatar.com/sayadbayezid
					</a>
					<a class="gravatar-hovercard__profile-link" href="https://gravatar.com/sayadbayezid?utm_source=profile-card" target="_blank">
						View profile →
					</a>
				</div>
					<div class="gravatar-hovercard__drawer" data-drawer-name="contact">
				<div class="gravatar-hovercard__drawer-backdrop" data-target-drawer="contact"></div>
				<div class="gravatar-hovercard__drawer-card">
					<div class="gravatar-hovercard__drawer-header">
						<h2 class="gravatar-hovercard__drawer-title">Contact</h2>
						<button class="gravatar-hovercard__drawer-close" data-target-drawer="contact">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 13.0607L15.7123 16.773L16.773 15.7123L13.0607 12L16.773 8.28772L15.7123 7.22706L12 10.9394L8.28771 7.22705L7.22705 8.28771L10.9394 12L7.22706 15.7123L8.28772 16.773L12 13.0607Z" fill="#101517"></path>
							</svg>
						</button>
					</div>
					<ul class="gravatar-hovercard__drawer-items">
						
<li class="gravatar-hovercard__drawer-item">
					<img class="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://s.gravatar.com/icons/mail.svg" alt="">
					<div class="gravatar-hovercard__drawer-item-info">
						<span class="gravatar-hovercard__drawer-item-label">Email</span>
						<span class="gravatar-hovercard__drawer-item-text"><a class="gravatar-hovercard__drawer-item-link" href="mailto:Info@sayadbayad.com" target="_blank">Info@sayadbayad.com</a></span>
					</div>
				</li>
			
<li class="gravatar-hovercard__drawer-item">
					<img class="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://s.gravatar.com/icons/envelope.svg" alt="">
					<div class="gravatar-hovercard__drawer-item-info">
						<span class="gravatar-hovercard__drawer-item-label">Contact Form</span>
						<span class="gravatar-hovercard__drawer-item-text"><a class="gravatar-hovercard__drawer-item-link" href="https://connectwithbayezid.it.com/contact" target="_blank">connectwithbayezid.it.com/contact</a></span>
					</div>
				</li>
				<li class="gravatar-hovercard__drawer-item">
					<img class="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://s.gravatar.com/icons/mobile-phone.svg" alt="">
					<div class="gravatar-hovercard__drawer-item-info">
						<span class="gravatar-hovercard__drawer-item-label">Cell Phone</span>
						<span class="gravatar-hovercard__drawer-item-text">01519601517</span>
					</div>
				</li>
			
</ul>
				</div>
			</div>
			<div class="gravatar-hovercard__drawer" data-drawer-name="send-money">
				<div class="gravatar-hovercard__drawer-backdrop" data-target-drawer="send-money"></div>
				<div class="gravatar-hovercard__drawer-card">
					<div class="gravatar-hovercard__drawer-header">
						<h2 class="gravatar-hovercard__drawer-title">Send money</h2>
						<button class="gravatar-hovercard__drawer-close" data-target-drawer="send-money">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 13.0607L15.7123 16.773L16.773 15.7123L13.0607 12L16.773 8.28772L15.7123 7.22706L12 10.9394L8.28771 7.22705L7.22705 8.28771L10.9394 12L7.22706 15.7123L8.28772 16.773L12 13.0607Z" fill="#101517"></path>
							</svg>
						</button>
					</div>
					<ul class="gravatar-hovercard__drawer-items">
						
<li class="gravatar-hovercard__drawer-item">
					<img class="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://s.gravatar.com/icons/link.svg" alt="">
					<div class="gravatar-hovercard__drawer-item-info">
						<span class="gravatar-hovercard__drawer-item-label">PayPal.me</span>
						<span class="gravatar-hovercard__drawer-item-text">
							<a class="gravatar-hovercard__drawer-item-link" href="https://www.paypal.me/Connectwithbayezid" target="_blank">
								www.paypal.me/Connectwithbayezid
							</a>
						</span>
					</div>
				</li>
			
<li class="gravatar-hovercard__drawer-item">
					<img class="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://s.gravatar.com/icons/link.svg" alt="">
					<div class="gravatar-hovercard__drawer-item-info">
						<span class="gravatar-hovercard__drawer-item-label">bitcoin</span>
						<span class="gravatar-hovercard__drawer-item-text">13NvP9k8aSCim5uXwwmwaHJLAtwYAgyo39</span>
					</div>
				</li>
			
<li class="gravatar-hovercard__drawer-item">
					<img class="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://s.gravatar.com/icons/link.svg" alt="">
					<div class="gravatar-hovercard__drawer-item-info">
						<span class="gravatar-hovercard__drawer-item-label">eth</span>
						<span class="gravatar-hovercard__drawer-item-text">0xd2776bf161ef367f785e3c35c3053d0a5a514220</span>
					</div>
				</li>
			
<li class="gravatar-hovercard__drawer-item">
					<img class="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://s.gravatar.com/icons/link.svg" alt="">
					<div class="gravatar-hovercard__drawer-item-info">
						<span class="gravatar-hovercard__drawer-item-label">BEP20</span>
						<span class="gravatar-hovercard__drawer-item-text">0xd2776bf161ef367f785e3c35c3053d0a5a514220</span>
					</div>
				</li>
			
</ul>
				</div>
			</div>
		
				
</div>
		<script>
		const hovercardInner = document.querySelector('.gravatar-hovercard__inner');

function openDrawer( target, container ) {
			const selector = '.gravatar-hovercard__drawer[data-drawer-name="' + target.dataset.targetDrawer + '"]';
			const drawer = container.querySelector( selector );
			drawer?.classList.add( 'gravatar-hovercard__drawer--open' );
		}

function closeDrawer( target, container ) {
			const selector = '.gravatar-hovercard__drawer[data-drawer-name="' + target.dataset.targetDrawer + '"]';
			const drawer = container.querySelector( selector );
			drawer?.classList.add( 'gravatar-hovercard__drawer--closing' );
			drawer?.classList.remove( 'gravatar-hovercard__drawer--open' );

setTimeout( () => {
				drawer?.classList.remove( 'gravatar-hovercard__drawer--closing' );
			}, 300 );
		}

hovercardInner.querySelectorAll( '.gravatar-hovercard__button' ).forEach( ( el ) => {
			el.addEventListener( 'click', () => openDrawer( el, hovercardInner ) );
		} );
		hovercardInner.querySelectorAll( '.gravatar-hovercard__drawer-close' ).forEach( ( el ) => {
			el.addEventListener( 'click', () => closeDrawer( el, hovercardInner ) );
		} );
		hovercardInner.querySelectorAll( '.gravatar-hovercard__drawer-backdrop' ).forEach( ( el ) => {
			el.addEventListener( 'click', () => closeDrawer( el, hovercardInner ) );
		} );
	</script></div>
---
**Last Updated:** May 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
