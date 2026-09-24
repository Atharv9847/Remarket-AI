from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.category import Category
from app.models.product import Product, ProductImage
from app.models.review import Review
from app.auth.security import get_password_hash
import datetime

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Check if already seeded
        if db.query(User).count() > 0:
            print("Database already contains data. Skipping seed.")
            return

        print("Seeding ReMarket second-hand database...")

        # 1. Create Users
        users = [
            User(
                name="Atharv (Demo Buyer/Seller)",
                email="atharv@example.com",
                phone="+91 98765 43210",
                password_hash=get_password_hash("password123"),
                profile_image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                location="Bengaluru, Indiranagar",
                latitude=12.9784,
                longitude=77.6408,
                role="user",
                status="active",
                response_rate=98,
                bio="Tech enthusiast & designer. Buying and trading pristine condition gadgets."
            ),
            User(
                name="Rohit Sharma (Pro Verified)",
                email="rohit.sharma@example.com",
                phone="+91 98111 22233",
                password_hash=get_password_hash("password123"),
                profile_image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                location="Bengaluru, Koramangala",
                latitude=12.9352,
                longitude=77.6245,
                role="user",
                status="active",
                response_rate=100,
                bio="Certified refurbished electronics trader. 5-star rating on 40+ deals."
            ),
            User(
                name="Priya Patel (Gear & Audio)",
                email="priya.tech@example.com",
                phone="+91 99000 88877",
                password_hash=get_password_hash("password123"),
                profile_image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
                location="Bengaluru, HSR Layout",
                latitude=12.9121,
                longitude=77.6446,
                role="user",
                status="active",
                response_rate=96,
                bio="Musician and audiophile. Offloading studio gear in mint condition."
            ),
            User(
                name="Admin ReMarket",
                email="admin@remarket.ai",
                phone="+91 90000 00000",
                password_hash=get_password_hash("admin123"),
                profile_image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                location="Bengaluru, MG Road",
                latitude=12.9716,
                longitude=77.5946,
                role="admin",
                status="active",
                response_rate=100,
                bio="Marketplace Moderator & Trust Coordinator."
            )
        ]
        db.add_all(users)
        db.commit()

        # 2. Create Categories & Subcategories
        categories_data = [
            ("Laptops & Computers", "laptops-computers", "Laptop", "High-performance MacBooks, ThinkPads, and gaming PCs", [
                ("MacBooks", "macbooks"),
                ("Windows Laptops", "windows-laptops"),
                ("Monitors & Displays", "monitors-displays")
            ]),
            ("Phones & Tablets", "phones-tablets", "Smartphone", "Smartphones, iPads, and cellular devices with verified battery", [
                ("iPhones", "iphones"),
                ("Android Flagships", "android-flagships"),
                ("iPads & Tablets", "ipads-tablets")
            ]),
            ("Cameras & Optics", "cameras-optics", "Camera", "Mirrorless cameras, prime lenses, and videography gear", [
                ("Mirrorless Bodies", "mirrorless-bodies"),
                ("Camera Lenses", "camera-lenses"),
                ("Audio & Mics", "audio-mics")
            ]),
            ("Audio & Studio", "audio-studio", "Headphones", "Noise-cancelling headphones, studio monitors, DACs", [
                ("Over-ear Headphones", "over-ear-headphones"),
                ("Earbuds", "earbuds"),
                ("Studio Gear", "studio-gear")
            ]),
            ("Bicycles & Mobility", "bicycles-mobility", "Bike", "Commuter cycles, MTBs, gravel bikes, and electric scooters", [
                ("Gravel & Road Bikes", "road-bikes"),
                ("Electric Scooters", "electric-scooters")
            ]),
            ("Furniture & Living", "furniture-living", "Armchair", "Ergonomic office chairs, minimalist standing desks", [
                ("Ergonomic Chairs", "ergonomic-chairs"),
                ("Desks & Tables", "desks-tables")
            ])
        ]

        created_categories = {}
        for cat_name, slug, icon, desc, subcats in categories_data:
            cat = Category(
                name=cat_name,
                slug=slug,
                icon=icon,
                description=desc,
                status=True
            )
            db.add(cat)
            db.commit()
            db.refresh(cat)
            created_categories[slug] = cat.id

            for sub_name, sub_slug in subcats:
                subcat = Category(
                    name=sub_name,
                    slug=sub_slug,
                    icon=icon,
                    parent_id=cat.id,
                    status=True
                )
                db.add(subcat)
            db.commit()

        # 3. Create Products with Real Unsplash Photos
        products_data = [
            {
                "seller_id": users[1].id, # Rohit
                "category_id": created_categories["laptops-computers"],
                "title": "Apple MacBook Pro 14\" M2 Pro (16GB, 512GB SSD) - Space Gray",
                "description": "Mint condition MacBook Pro 14-inch with Apple Silicon M2 Pro chip. Battery health at 96% with only 48 charge cycles. Includes original MagSafe cable, 67W power adapter, and original retail box. Zero scratches on body or Retina screen.",
                "brand": "Apple",
                "model": "MacBook Pro 14\"",
                "year": 2023,
                "condition": "Like New",
                "price": 128000.0,
                "original_price": 199900.0,
                "negotiable": True,
                "exchange_available": True,
                "delivery_available": True,
                "location": "Koramangala, Bengaluru",
                "latitude": 12.9352,
                "longitude": 77.6245,
                "tags": "apple, macbook, m2pro, laptop, coding, video-editing",
                "images": [
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80"
                ]
            },
            {
                "seller_id": users[2].id, # Priya
                "category_id": created_categories["cameras-optics"],
                "title": "Sony Alpha A7 III Full-Frame Mirrorless + FE 28-70mm Lens Kit",
                "description": "Clean Sony A7 III full-frame mirrorless camera body and kit lens. Shutter count under 8,200 (rated for 200k). Sensor is immaculate, sensor cleaning conducted recently. Comes with 2 Sony NP-FZ100 original batteries, Dual charger, and 64GB Extreme Pro SD card.",
                "brand": "Sony",
                "model": "Alpha A7 III",
                "year": 2022,
                "condition": "Good",
                "price": 94500.0,
                "original_price": 165000.0,
                "negotiable": True,
                "exchange_available": False,
                "delivery_available": True,
                "location": "HSR Layout, Bengaluru",
                "latitude": 12.9121,
                "longitude": 77.6446,
                "tags": "sony, a7iii, mirrorless, fullframe, 4k, photography",
                "images": [
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80"
                ]
            },
            {
                "seller_id": users[1].id, # Rohit
                "category_id": created_categories["phones-tablets"],
                "title": "iPhone 15 Pro 128GB - Natural Titanium (Bill, Box & 100% Battery)",
                "description": "Bought 7 months ago with Apple warranty valid till December 2026. Flawless titanium frame, always used with Spigen tempered glass and silicone case. Battery maximum capacity at 99%. Bill and original USB-C braided cable included.",
                "brand": "Apple",
                "model": "iPhone 15 Pro",
                "year": 2024,
                "condition": "Like New",
                "price": 89000.0,
                "original_price": 134900.0,
                "negotiable": True,
                "exchange_available": True,
                "delivery_available": True,
                "location": "Indiranagar, Bengaluru",
                "latitude": 12.9784,
                "longitude": 77.6408,
                "tags": "iphone, iphone15pro, titanium, apple, 5g",
                "images": [
                    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80"
                ]
            },
            {
                "seller_id": users[2].id, # Priya
                "category_id": created_categories["audio-studio"],
                "title": "Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones",
                "description": "Silver color Sony XM5 flagship headphones. Crystal clear call quality, industry-leading active noise cancellation. Used primarily on work desk, cushions are clean and sterile. Includes original hard carrying travel case and 3.5mm gold plated audio cable.",
                "brand": "Sony",
                "model": "WH-1000XM5",
                "year": 2023,
                "condition": "Like New",
                "price": 19500.0,
                "original_price": 34990.0,
                "negotiable": True,
                "exchange_available": False,
                "delivery_available": True,
                "location": "Koramangala, Bengaluru",
                "latitude": 12.9352,
                "longitude": 77.6245,
                "tags": "sony, xm5, anc, headphones, audiophile, wireless",
                "images": [
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"
                ]
            },
            {
                "seller_id": users[0].id, # Atharv
                "category_id": created_categories["bicycles-mobility"],
                "title": "Trek FX 2 Disc Hybrid Commuter Bicycle (Medium Frame, Hydraulic Brakes)",
                "description": "Lightweight Alpha Gold Aluminum frame hybrid bicycle. 2x9 Shimano drivetrain with rapid-fire shifters and Tektro hydraulic disc brakes for stopping in all weather. Serviced at Trek Bicycles Indiranagar last month. Fitted with bottle cage and kickstand.",
                "brand": "Trek",
                "model": "FX 2 Disc",
                "year": 2023,
                "condition": "Good",
                "price": 32000.0,
                "original_price": 54000.0,
                "negotiable": True,
                "exchange_available": True,
                "delivery_available": False,
                "location": "Indiranagar, Bengaluru",
                "latitude": 12.9784,
                "longitude": 77.6408,
                "tags": "bicycle, trek, hybrid, shimano, cycling, fitness",
                "images": [
                    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1000&q=80"
                ]
            },
            {
                "seller_id": users[1].id, # Rohit
                "category_id": created_categories["furniture-living"],
                "title": "Herman Miller Aeron Ergonomic Office Chair (Size B, Fully Loaded)",
                "description": "Original Herman Miller Aeron Remastered chair with PostureFit SL back support, tilt limiter, forward tilt, and fully adjustable 3D armrests. Mineral colorway. Supreme comfort for 10+ hour coding and remote work sessions. Mechanism runs butter-smooth.",
                "brand": "Herman Miller",
                "model": "Aeron Size B",
                "year": 2022,
                "condition": "Good",
                "price": 68000.0,
                "original_price": 145000.0,
                "negotiable": True,
                "exchange_available": False,
                "delivery_available": True,
                "location": "Whitefield, Bengaluru",
                "latitude": 12.9698,
                "longitude": 77.7500,
                "tags": "hermanmiller, aeron, ergonomic, chair, office, workfromhome",
                "images": [
                    "https://images.unsplash.com/photo-1580481077190-73614591e80d?auto=format&fit=crop&w=1000&q=80"
                ]
            },
            {
                "seller_id": users[2].id, # Priya
                "category_id": created_categories["laptops-computers"],
                "title": "Dell UltraSharp 27\" 4K USB-C Monitor (U2723QE - IPS Black)",
                "description": "Professional 4K color accurate IPS Black panel with 2000:1 contrast ratio and 90W USB-C hub connectivity. Clean matte screen, zero dead pixels or backlight bleed. Factory calibrated 98% DCI-P3 color gamut. Perfect for Mac and Windows creator setups.",
                "brand": "Dell",
                "model": "U2723QE",
                "year": 2023,
                "condition": "Like New",
                "price": 38000.0,
                "original_price": 62000.0,
                "negotiable": True,
                "exchange_available": False,
                "delivery_available": True,
                "location": "HSR Layout, Bengaluru",
                "latitude": 12.9121,
                "longitude": 77.6446,
                "tags": "dell, ultrasharp, 4k, monitor, usbc, display",
                "images": [
                    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
                ]
            },
            {
                "seller_id": users[0].id, # Atharv
                "category_id": created_categories["audio-studio"],
                "title": "Apple AirPods Pro (2nd Generation, MagSafe USB-C Case)",
                "description": "AirPods Pro Gen 2 with USB-C case. Active Noise Cancellation with Adaptive Audio and Transparency Mode. Original ear tips in sizes XS, S, M, L included in pristine condition. AppleCare coverage active.",
                "brand": "Apple",
                "model": "AirPods Pro 2",
                "year": 2024,
                "condition": "Like New",
                "price": 14500.0,
                "original_price": 24900.0,
                "negotiable": True,
                "exchange_available": True,
                "delivery_available": True,
                "location": "Indiranagar, Bengaluru",
                "latitude": 12.9784,
                "longitude": 77.6408,
                "tags": "apple, airpods, anc, audio, earbuds, usbc",
                "images": [
                    "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80"
                ]
            }
        ]

        for p_data in products_data:
            img_urls = p_data.pop("images")
            prod = Product(**p_data, views=42, likes_count=7, status="active")
            db.add(prod)
            db.commit()
            db.refresh(prod)

            for idx, u in enumerate(img_urls):
                p_img = ProductImage(product_id=prod.id, image_url=u, sort_order=idx)
                db.add(p_img)
            db.commit()

        # 4. Add Reviews
        reviews_data = [
            Review(
                reviewer_id=users[0].id,
                reviewee_id=users[1].id,
                product_id=1,
                rating=5.0,
                review="Rohit is an exceptional seller! The MacBook arrived in spotless condition, exactly as described. Prompt communication and verification was effortless."
            ),
            Review(
                reviewer_id=users[1].id,
                reviewee_id=users[2].id,
                product_id=2,
                rating=5.0,
                review="Priya took great care of the camera gear. The shutter count and glass quality were genuine. Highly recommended trustworthy member."
            )
        ]
        db.add_all(reviews_data)
        db.commit()

        print("Database seeded successfully with categories, users, products, and reviews!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
