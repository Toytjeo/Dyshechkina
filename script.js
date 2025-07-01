        let counter1 = 0, counter2 = 0, counter3 = 0;
        let config = { owner: 'toytjeo', repo:'Dyshechkina', token: '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'};
        
        // REPLACE THESE WITH YOUR GITHUB INFO AFTER SETUP:
        // config = { owner: 'your-username', repo: 'your-repo', token: 'your-token' };
        
        // Load saved config
        const saved = localStorage.getItem('config');
        if (saved) {
            config = JSON.parse(saved);
            document.getElementById('setup').style.display = 'none';
            loadCounter();
        }
        
        function updateTotal() {
            const total = counter1 + counter2 + counter3;
            document.getElementById('total').textContent = total;
        }
        
        function saveSetup() {
            const owner = document.getElementById('owner').value;
            const repo = document.getElementById('repo').value;
            const token = document.getElementById('token').value;
            
            if (owner && repo && token) {
                config = { owner, repo, token };
                localStorage.setItem('config', JSON.stringify(config));
                document.getElementById('setup').style.display = 'none';
                loadCounter();
            }
        }
        
        async function loadCounter() {
            if (!config.owner) return;
            
            try {
                const response = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/issues/1/comments`, {
                    headers: { 'Authorization': `token ${config.token}` }
                });
                
                if (response.ok) {
                    const comments = await response.json();
                    counter1 = comments.filter(c => c.body.includes('button1')).length;
                    counter2 = comments.filter(c => c.body.includes('button2')).length;
                    counter3 = comments.filter(c => c.body.includes('button3')).length;
                    
                    document.getElementById('number1').textContent = counter1;
                    document.getElementById('number2').textContent = counter2;
                    document.getElementById('number3').textContent = counter3;
                    updateTotal();
                }
            } catch (error) {
                console.error('Error loading:', error);
            }
        }
        
        async function addOne(buttonNum) {
            if (!config.owner) return;
            
            const button = document.getElementById(`button${buttonNum}`);
            button.disabled = true;
            
            try {
                const response = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/issues/1/comments`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${config.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ body: `button${buttonNum} +1` })
                });
                
                if (response.ok) {
                    if (buttonNum === 1) counter1++;
                    else if (buttonNum === 2) counter2++;
                    else if (buttonNum === 3) counter3++;
                    
                    document.getElementById(`number${buttonNum}`).textContent = 
                        buttonNum === 1 ? counter1 : buttonNum === 2 ? counter2 : counter3;
                    updateTotal();
                    
                    // Animation
                    const num = document.getElementById(`number${buttonNum}`);
                    num.style.transform = 'scale(1.1)';
                    setTimeout(() => num.style.transform = 'scale(1)', 150);
                }
            } catch (error) {
                console.error('Error adding:', error);
            }
            
            button.disabled = false;
        }
        
        // Auto-refresh every 10 seconds
        setInterval(loadCounter, 10000);
        
        // Keyboard support
        document.addEventListener('keydown', function(event) {
            if (event.key === '1') addOne(1);
            else if (event.key === '2') addOne(2);
            else if (event.key === '3') addOne(3);
        });
