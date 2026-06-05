import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.room_model import Room
from app.models.puzzle_model import Puzzle

router = APIRouter(prefix="/admin", tags=["Admin"])

ROOMS = [
    {
        "id": 1,
        "name": "Bollywood Beats",
        "description": "Decode iconic Hindi film songs through emoji clues, lyric fills, and rapid-fire challenges. From 90s classics to modern chartbusters!",
        "difficulty": "medium",
    },
    {
        "id": 2,
        "name": "Sandalwood Symphony",
        "description": "Journey through Karnataka's finest melodies — Gaalipata, Hudugaru, Mungaru Male and beyond. Prove your Kannada film music mastery!",
        "difficulty": "hard",
    },
    {
        "id": 3,
        "name": "K-Pop Fever",
        "description": "Enter the neon-lit world of BTS, BLACKPINK, EXO, TWICE and more. From Dynamite to Spring Day — how deep does your K-Pop knowledge go?",
        "difficulty": "easy",
    },
]

PUZZLES = [

    # ══════════════════════════════════════════════════════
    # ROOM 1 — BOLLYWOOD BEATS  (7 puzzles)
    # Songs: Tum Hi Ho, Kal Ho Na Ho, Rang De Basanti,
    #        Chaiyya Chaiyya, DDLJ, Ae Dil Hai Mushkil, Kabira
    # ══════════════════════════════════════════════════════
    {
        "room_id": 1, "puzzle_order": 1, "type": "emoji_song",
        "title": "Emoji Raaga",
        "question": "These emojis together tell the story of a Bollywood song. Decode the title!",
        "answer": "Tum Hi Ho",
        "audio_url": None, "image_url": None,
        "hint": "From Aashiqui 2 (2013). Sung by Arijit Singh. A heartbreak love anthem.",
        "options_json": json.dumps({"emojis": "👆❤️🎭💔🌧️"}),
    },
    {
        "room_id": 1, "puzzle_order": 2, "type": "finish_lyrics",
        "title": "Antara Pehchano",
        "question": "A classic Bollywood song pauses right before the next line. Complete it!",
        "answer": "chhao hai kabhi kabhi hai dhoop zindagi",
        "audio_url": None, "image_url": None,
        "hint": "From the 2003 film 'Kal Ho Na Ho'. Sung by Sonu Nigam.",
        "options_json": json.dumps({"displayed_lyric": "Har ghadi badal rahi hai roop zindagi..."}),
    },
    {
        "room_id": 1, "puzzle_order": 3, "type": "lost_translation",
        "title": "Anuvad Pehchano",
        "question": "This English description captures the soul of a famous Bollywood song. Name the original!",
        "answer": "Rang De Basanti",
        "audio_url": None, "image_url": None,
        "hint": "2006 film. AR Rahman music. Story of youth, revolution, and sacrifice.",
        "options_json": json.dumps({"translation": "Paint me in the colour of freedom, let my blood merge with the morning sky — the youth of this nation will not be silenced"}),
    },
    {
        "room_id": 1, "puzzle_order": 4, "type": "picture_tune",
        "title": "Tasveer Gao",
        "question": "These image clues point to an iconic Bollywood song. Can you guess it?",
        "answer": "Kal Ho Na Ho",
        "audio_url": None,
        "image_url": "https://placehold.co/600x400/05050F/00E5FF?text=🏙️+NYC+Skyline+%2B+🤝+Best+Friends+%2B+💊+Hospital",
        "hint": "Shah Rukh Khan, Preity Zinta, Saif Ali Khan. Set in New York City. 2003.",
        "options_json": None,
    },
    {
        "room_id": 1, "puzzle_order": 5, "type": "rapid_fire",
        "title": "Bollywood Blitz",
        "question": "5 rapid-fire Bollywood music questions! Answer at least 3 correctly to unlock the next puzzle.",
        "answer": "pass",
        "audio_url": None, "image_url": None,
        "hint": "Think about iconic composers, singers, and films from the 90s and 2000s.",
        "options_json": json.dumps({"questions": [
            {"q": "AR Rahman won the Oscar for which film's music?", "a": "Slumdog Millionaire"},
            {"q": "Who sang 'Tum Hi Ho' from Aashiqui 2?", "a": "Arijit Singh"},
            {"q": "Which film featured 'Chaiyya Chaiyya' on top of a train?", "a": "Dil Se"},
            {"q": "DDLJ stands for Dilwale Dulhania Le what?", "a": "Jayenge"},
            {"q": "Who composed the music for 'Lagaan'?", "a": "AR Rahman"},
        ]}),
    },
    {
        "room_id": 1, "puzzle_order": 6, "type": "beat_match",
        "title": "Singer Pehchano",
        "question": "Match each Bollywood song with its correct singer. Click a song then click its artist!",
        "answer": "client_validated",
        "audio_url": None, "image_url": None,
        "hint": "Think about each song's era — 60s, 80s, 90s, 2000s, 2010s each had different voices.",
        "options_json": json.dumps({"pairs": [
            {"song": "Tum Hi Ho", "artist": "Arijit Singh"},
            {"song": "Kal Ho Na Ho", "artist": "Sonu Nigam"},
            {"song": "Chaiyya Chaiyya", "artist": "Sukhwinder Singh"},
            {"song": "Mere Sapno Ki Rani", "artist": "Kishore Kumar"},
            {"song": "Ek Pyar Ka Nagma", "artist": "Mukesh"},
        ]}),
    },
    {
        "room_id": 1, "puzzle_order": 7, "type": "missing_word",
        "title": "Bhari Jagah",
        "question": "Fill in the two missing words from this iconic DDLJ lyric!",
        "answer": "Sanam,Ek",
        "audio_url": None, "image_url": None,
        "hint": "Sung by Kumar Sanu and Lata Mangeshkar. Picturised on SRK and Kajol in mustard fields.",
        "options_json": json.dumps({
            "lyrics": "Tujhe Dekha To Yeh Jana ___ , Pyar Hota Hai ___ Deewana",
            "blanks": ["Sanam", "Ek"],
        }),
    },

    # ══════════════════════════════════════════════════════
    # ROOM 2 — SANDALWOOD SYMPHONY  (7 puzzles)
    # Songs: Simple Aagiduva Hodaga, Cheluvina Chittara,
    #        Minchagi Nagutha Baa, Jothe Jotheyali,
    #        Bombe Helutaithe, Ninna Nenapu, Gaalipata
    # ══════════════════════════════════════════════════════
    {
        "room_id": 2, "puzzle_order": 1, "type": "emoji_song",
        "title": "Kannada Emoji Beat",
        "question": "Decode the Kannada film song from these emoji clues!",
        "answer": "Simple Aagiduva Hodaga",
        "audio_url": None, "image_url": None,
        "hint": "From the 2008 film Gaalipata. Carefree youth romance. Ganesh & Daisy Bopanna.",
        "options_json": json.dumps({"emojis": "🪁😊💑☀️🌿"}),
    },
    {
        "room_id": 2, "puzzle_order": 2, "type": "finish_lyrics",
        "title": "Sahitya Puriso",
        "question": "This popular Kannada song lyric cuts off — type the next line to complete it!",
        "answer": "manasu naachide",
        "audio_url": None, "image_url": None,
        "hint": "From Hudugaru (2011). Upbeat number. Armaan Malik sang this.",
        "options_json": json.dumps({"displayed_lyric": "Minchagi nagutha baa, ninna nodutaa..."}),
    },
    {
        "room_id": 2, "puzzle_order": 3, "type": "lost_translation",
        "title": "Bhasha Bodhe",
        "question": "This poetic English description perfectly describes a Kannada film song. Identify it!",
        "answer": "Cheluvina Chittara",
        "audio_url": None, "image_url": None,
        "hint": "The title literally means 'Beautiful Portrait/Painting'. From Gaalipata (2008).",
        "options_json": json.dumps({"translation": "She is the most beautiful painting in the world — every glance is a brushstroke of God, every step she takes colours the earth around her"}),
    },
    {
        "room_id": 2, "puzzle_order": 4, "type": "picture_tune",
        "title": "Chitra Gaayana",
        "question": "These image clues all point to one famous Kannada film and its title song. Name it!",
        "answer": "Gaalipata",
        "audio_url": None,
        "image_url": "https://placehold.co/600x400/05050F/8B5CF6?text=🪁+Flying+Kite+%2B+🏫+College+%2B+👫+Young+Couple",
        "hint": "Title means 'Kite' in Kannada. Youth romance film from 2008. Ganesh starred.",
        "options_json": None,
    },
    {
        "room_id": 2, "puzzle_order": 5, "type": "rapid_fire",
        "title": "Sandalwood Speed Round",
        "question": "5 rapid-fire Sandalwood music questions! Get at least 3 right to proceed.",
        "answer": "pass",
        "audio_url": None, "image_url": None,
        "hint": "Focus on popular films from Rajkumar, Puneeth, Ganesh, and Sudeep.",
        "options_json": json.dumps({"questions": [
            {"q": "Who sang 'Jothe Jotheyali' from Mungaru Male?", "a": "Sonu Nigam"},
            {"q": "Puneeth Rajkumar's popular nickname?", "a": "Power Star"},
            {"q": "Gaalipata (2008) was directed by?", "a": "Yogaraj Bhat"},
            {"q": "Which actor starred in Hudugaru (2011)?", "a": "Ganesh"},
            {"q": "Sudeep's blockbuster action film from 2017?", "a": "Tagaru"},
        ]}),
    },
    {
        "room_id": 2, "puzzle_order": 6, "type": "beat_match",
        "title": "Haadugara Panjara",
        "question": "Match each Kannada song with its correct singer!",
        "answer": "client_validated",
        "audio_url": None, "image_url": None,
        "hint": "From Rajkumar legends to modern voices like Armaan Malik and Sanjith Hegde.",
        "options_json": json.dumps({"pairs": [
            {"song": "Jothe Jotheyali", "artist": "Sonu Nigam"},
            {"song": "Minchagi Nagutha Baa", "artist": "Armaan Malik"},
            {"song": "Cheluvina Chittara", "artist": "Karthik"},
            {"song": "Ninna Nenapu", "artist": "Sanjith Hegde"},
            {"song": "Bombe Helutaithe", "artist": "Rajkumar"},
        ]}),
    },
    {
        "room_id": 2, "puzzle_order": 7, "type": "missing_word",
        "title": "Padyada Tuppa",
        "question": "Fill in the two missing words from this beloved Gaalipata song!",
        "answer": "hogade,jaaga",
        "audio_url": None, "image_url": None,
        "hint": "From 'Jothe Jotheyali' — Mungaru Male (2006). Sonu Nigam's voice.",
        "options_json": json.dumps({
            "lyrics": "Jothe jotheyali saagona, nee ___ iro, ee ___ bittu",
            "blanks": ["hogade", "jaaga"],
        }),
    },

    # ══════════════════════════════════════════════════════
    # ROOM 3 — K-POP FEVER  (7 puzzles)
    # Songs: Dynamite, Butter, Spring Day, Fake Love,
    #        DDU-DU DDU-DU, Ko Ko Bop, Fancy, God's Menu
    # ══════════════════════════════════════════════════════
    {
        "room_id": 3, "puzzle_order": 1, "type": "emoji_song",
        "title": "K-Emoji Challenge",
        "question": "These emoji clues represent a massive K-Pop hit. Decode the song title!",
        "answer": "Dynamite",
        "audio_url": None, "image_url": None,
        "hint": "BTS. Released August 2020. Their first all-English track. Retro disco vibes.",
        "options_json": json.dumps({"emojis": "💥🕺🪩✨🌟"}),
    },
    {
        "room_id": 3, "puzzle_order": 2, "type": "finish_lyrics",
        "title": "Finish The Hook",
        "question": "This BTS mega-hit cuts off right before its iconic hook. Complete the lyric!",
        "answer": "Gon' pop like trouble breaking into your heart like that",
        "audio_url": None, "image_url": None,
        "hint": "BTS 2021. Billboard Hot 100 #1. Think smooth, creamy, and irresistible.",
        "options_json": json.dumps({"displayed_lyric": "Smooth like butter, like a criminal undercover..."}),
    },
    {
        "room_id": 3, "puzzle_order": 3, "type": "lost_translation",
        "title": "Lost In Translation",
        "question": "This English description captures the emotion of a beloved BTS ballad. Name the song!",
        "answer": "Spring Day",
        "audio_url": None, "image_url": None,
        "hint": "BTS 2017. Korean title is 봄날 (Bomnal). One of their most emotional songs.",
        "options_json": json.dumps({"translation": "I wait through endless frozen winter nights just to see your face again — you are the warmth I cannot reach, the spring morning I keep dreaming of"}),
    },
    {
        "room_id": 3, "puzzle_order": 4, "type": "picture_tune",
        "title": "Album Art Challenge",
        "question": "These visual clues are taken from a BTS music video and era. Identify the song!",
        "answer": "Fake Love",
        "audio_url": None,
        "image_url": "https://placehold.co/600x400/05050F/FF2D78?text=🎭+Mask+%2B+💔+Broken+Heart+%2B+🌹+Dark+Rose",
        "hint": "BTS 2018. From the Love Yourself: Tear album. Dark, intense music video.",
        "options_json": None,
    },
    {
        "room_id": 3, "puzzle_order": 5, "type": "rapid_fire",
        "title": "K-Pop Speed Round",
        "question": "5 rapid-fire K-Pop questions! Prove you're a true stan — get 3 of 5 to advance.",
        "answer": "pass",
        "audio_url": None, "image_url": None,
        "hint": "Know your BTS, BLACKPINK, EXO, and TWICE facts.",
        "options_json": json.dumps({"questions": [
            {"q": "BTS debuted under which entertainment company?", "a": "Big Hit Entertainment"},
            {"q": "How many members are in BLACKPINK?", "a": "4"},
            {"q": "Which BTS song was their first all-English track?", "a": "Dynamite"},
            {"q": "TWICE's fandom name is?", "a": "ONCE"},
            {"q": "EXO's smash 2013 single about obsession?", "a": "Growl"},
        ]}),
    },
    {
        "room_id": 3, "puzzle_order": 6, "type": "beat_match",
        "title": "K-Pop Artist Match",
        "question": "Match each K-Pop song with its correct artist or group!",
        "answer": "client_validated",
        "audio_url": None, "image_url": None,
        "hint": "BTS, BLACKPINK, EXO, TWICE, Stray Kids — all five are different groups!",
        "options_json": json.dumps({"pairs": [
            {"song": "Dynamite", "artist": "BTS"},
            {"song": "DDU-DU DDU-DU", "artist": "BLACKPINK"},
            {"song": "Ko Ko Bop", "artist": "EXO"},
            {"song": "Fancy", "artist": "TWICE"},
            {"song": "God's Menu", "artist": "Stray Kids"},
        ]}),
    },
    {
        "room_id": 3, "puzzle_order": 7, "type": "missing_word",
        "title": "Fill The Blank",
        "question": "Fill in the two missing words from this iconic BTS Spring Day lyric!",
        "answer": "you,lonely",
        "audio_url": None, "image_url": None,
        "hint": "BTS — 봄날 (Spring Day, 2017). One of the most emotional K-Pop songs ever written.",
        "options_json": json.dumps({
            "lyrics": "I miss you, I miss ___ , saying this makes me even more ___",
            "blanks": ["you", "lonely"],
        }),
    },
]


@router.post("/seed")
def seed_database(db: Session = Depends(get_db)):
    db.query(Puzzle).delete()
    db.query(Room).delete()
    db.commit()

    for room_data in ROOMS:
        db.add(Room(
            id=room_data["id"],
            name=room_data["name"],
            description=room_data["description"],
            difficulty=room_data["difficulty"],
        ))
    db.commit()

    for p in PUZZLES:
        db.add(Puzzle(
            room_id=p["room_id"],
            puzzle_order=p["puzzle_order"],
            type=p["type"],
            title=p["title"],
            question=p["question"],
            answer=p["answer"],
            audio_url=p.get("audio_url"),
            image_data=None,
            hint=p["hint"],
            options_json=p.get("options_json"),
        ))
    db.commit()

    return {
        "message": "Database seeded successfully",
        "rooms": len(ROOMS),
        "puzzles": len(PUZZLES),
    }
